import { apiClient } from '../api/client'
import { defineStore } from 'pinia'
import { nextTick } from 'vue'
import { onMounted } from 'vue'
import { onUnmounted } from 'vue'
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useMagicKeys } from '@vueuse/core'
import { useMouse } from '@vueuse/core'
import { whenever } from '@vueuse/core'

export type Article = Awaited<ReturnType<typeof fetchArticles>>[number]

async function fetchArticles() {
  const res = await apiClient.api.articles.$get()
  return await res.json()
}

export const useArticleStore = defineStore('articles', () => {
  const articles = ref<Article[]>([])
  const currentIndex = ref(-1)
  const articleRefs = ref<HTMLElement[]>([])
  const viewMode = ref<Record<number, 'hidden' | 'summary' | 'actions'>>({})
  const removedArticles = useLocalStorage<number[]>('removedArticles', [])

  // Setup Keyboard Shortcuts using VueUse
  const { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Enter, Space, Escape, Delete } = useMagicKeys()
  const { y } = useMouse({ type: 'client' })

  function getClosestIndexToMouse() {
    let closestIndex = 0
    let minDistance = Infinity

    articleRefs.value.forEach((el, index) => {
      if (!el) {
        return
      }
      const rect = el.getBoundingClientRect()
      const distance = Math.abs(rect.top + rect.height / 2 - y.value)
      if (distance < minDistance) {
        minDistance = distance
        closestIndex = index
      }
    })

    return closestIndex
  }

  whenever(ArrowUp, () => {
    let nextIndex = currentIndex.value - 1
    if (currentIndex.value === -1) {
      nextIndex = getClosestIndexToMouse()
    }
    return setFocus(Math.max(0, nextIndex), true)
  })
  whenever(ArrowDown, () => {
    let nextIndex = currentIndex.value + 1
    if (currentIndex.value === -1) {
      nextIndex = Math.min(articles.value.length - 1, getClosestIndexToMouse())
    }
    return setFocus(Math.min(articles.value.length - 1, nextIndex), true)
  })

  async function trackEvent(event: string, articleId: number) {
    try {
      await apiClient.api.analytics.track.$post({
        json: { event, articleId },
      })
    } catch (e) {
      console.error('Failed to track event', e)
    }
  }

  whenever(ArrowLeft, () => {
    if (currentIndex.value < 0) {
      return
    }
    const id = articles.value[currentIndex.value]?.id
    if (!id) {
      return
    }

    const mode = viewMode.value[id] ?? 'summary'

    switch (mode) {
      case 'actions': {
        viewMode.value[id] = 'summary'

        break
      }
      case 'summary': {
        viewMode.value[id] = 'hidden'

        break
      }
      case 'hidden': {
        // Delete
        if (!removedArticles.value.includes(id)) {
          removedArticles.value.push(id)
        }
        articles.value.splice(currentIndex.value, 1)
        setFocus(Math.min(currentIndex.value, Math.max(0, articles.value.length - 1)), true)

        break
      }
      // No default
    }
  })

  whenever(ArrowRight, async () => {
    if (currentIndex.value < 0) {
      return
    }
    const id = articles.value[currentIndex.value]?.id
    const url = articles.value[currentIndex.value]
      ? `${articles.value[currentIndex.value].publisher.url}${articles.value[currentIndex.value].pathname}`
      : undefined
    if (!url || !id) {
      return
    }

    const mode = viewMode.value[id] ?? 'summary'

    if (mode === 'hidden') {
      viewMode.value[id] = 'summary'
      await trackEvent('expand_summary', id)
    } else if (mode === 'summary') {
      viewMode.value[id] = 'actions'
    }
  })

  whenever(
    () => Enter.value || Space.value,
    async () => {
      const id = articles.value[currentIndex.value]?.id
      const url = articles.value[currentIndex.value]
        ? `${articles.value[currentIndex.value].publisher.url}${articles.value[currentIndex.value].pathname}`
        : undefined
      if (url && id) {
        await trackEvent('open_url', id)
        window.open(url, '_blank')
      }
    }
  )

  whenever(Escape, () => setFocus(-1))

  whenever(Delete, () => {
    if (currentIndex.value < 0) {
      return
    }
    const id = articles.value[currentIndex.value]?.id
    if (id && !removedArticles.value.includes(id)) {
      removedArticles.value.push(id)
    }
    articles.value.splice(currentIndex.value, 1)
    setFocus(Math.min(currentIndex.value, Math.max(0, articles.value.length - 1)), true)
  })

  let eventSource: EventSource | null = null

  onMounted(() => {
    void loadArticles()

    // Connect to server-sent events for article updates
    eventSource = new EventSource('/api/stream')
    eventSource.onmessage = (event) => {
      console.log('Received update from server:', event.data)
      void loadArticles()
    }
  })

  onUnmounted(() => {
    if (eventSource) {
      eventSource.close()
    }
  })

  async function loadArticles() {
    const data = await fetchArticles()
    articles.value = data.filter((a) => !removedArticles.value.includes(a.id))
  }

  function formatTime(t: number | string | Date) {
    if (!t) {
      return ''
    }
    return new Date(t)
      .toLocaleTimeString('da-DK', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Copenhagen',
      })
      .split(' ')
      .reverse()
      .join(' ')
  }

  function formatSummary(a: Article) {
    return (a.summary || '').replace(/\.\.$/, '.')
  }

  function setFocus(index: number, scrollIntoView = false) {
    currentIndex.value = index
    if (scrollIntoView && index >= 0 && articleRefs.value[index]) {
      void nextTick(() => {
        articleRefs.value[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }
  }

  function resetHiddenArticles() {
    removedArticles.value = []
    void loadArticles()
  }

  return {
    articles,
    currentIndex,
    articleRefs,
    viewMode,
    formatTime,
    formatSummary,
    setFocus,
    resetHiddenArticles,
    trackEvent,
  }
})
