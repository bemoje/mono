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

export interface Article {
  type: 'article' | 'card'
  time: number
  category: string
  heading: string
  summary: string
  url: string
}

export const useArticleStore = defineStore('articles', () => {
  const articles = ref<Article[]>([])
  const currentIndex = ref(-1)
  const articleRefs = ref<HTMLElement[]>([])
  const viewMode = ref<Record<string, 'hidden' | 'summary' | 'actions'>>({})
  const removedArticles = useLocalStorage<string[]>('removedArticles', [])

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

  async function trackEvent(event: string, url: string) {
    try {
      await apiClient.api.analytics.track.$post({
        json: { event, url },
      })
    } catch (e) {
      console.error('Failed to track event', e)
    }
  }

  whenever(ArrowLeft, () => {
    if (currentIndex.value < 0) {
      return
    }
    const url = articles.value[currentIndex.value]?.url
    if (!url) {
      return
    }

    const mode = viewMode.value[url] ?? 'summary'

    switch (mode) {
      case 'actions': {
        viewMode.value[url] = 'summary'

        break
      }
      case 'summary': {
        viewMode.value[url] = 'hidden'

        break
      }
      case 'hidden': {
        // Delete
        if (!removedArticles.value.includes(url)) {
          removedArticles.value.push(url)
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
    const url = articles.value[currentIndex.value]?.url
    if (!url) {
      return
    }

    const mode = viewMode.value[url] ?? 'summary'

    if (mode === 'hidden') {
      viewMode.value[url] = 'summary'
      await trackEvent('expand_summary', url)
    } else if (mode === 'summary') {
      viewMode.value[url] = 'actions'
    }
  })

  whenever(
    () => {
      return Enter.value || Space.value
    },
    async () => {
      const url = articles.value[currentIndex.value]?.url
      if (url) {
        await trackEvent('open_url', url)
        window.open(url, '_blank')
      }
    }
  )

  whenever(Escape, () => {
    return setFocus(-1)
  })

  whenever(Delete, () => {
    if (currentIndex.value < 0) {
      return
    }
    const url = articles.value[currentIndex.value]?.url
    if (url && !removedArticles.value.includes(url)) {
      removedArticles.value.push(url)
    }
    articles.value.splice(currentIndex.value, 1)
    setFocus(Math.min(currentIndex.value, Math.max(0, articles.value.length - 1)), true)
  })

  let eventSource: EventSource | null = null

  onMounted(() => {
    void fetchArticles()

    // Connect to server-sent events for article updates
    eventSource = new EventSource('/api/stream')
    eventSource.onmessage = (event) => {
      console.log('Received update from server:', event.data)
      void fetchArticles()
    }
  })

  onUnmounted(() => {
    if (eventSource) {
      eventSource.close()
    }
  })

  async function fetchArticles() {
    try {
      const res = await apiClient.api.articles.$get()
      if (res.ok) {
        const data = await res.json()

        articles.value = (data as unknown as Article[]).filter((a: Article) => {
          return !removedArticles.value.includes(a.url)
        })
      }
    } catch (err) {
      console.error('Failed to load articles', err)
    }
  }

  function formatTime(t: number) {
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
    void fetchArticles()
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
