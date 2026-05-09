<script setup lang="ts">
import { computed } from 'vue'
import { useArticleStore, type Article } from '../stores/articleStore'

const props = defineProps<{
  article: Article
  index: number
  isFocused: boolean
}>()

const emit = defineEmits(['mousedown'])
const store = useArticleStore()

const timeStr = computed(() => store.formatTime(props.article.time))
const summaryStr = computed(() => store.formatSummary(props.article))
const mode = computed(() => store.viewMode[props.article.url])

function onMousedown(event: MouseEvent) {
  emit('mousedown', event, props.index)
}
</script>

<template>
  <article
    class="article group bg-white rounded-lg border px-3 py-2.5 cursor-pointer transition-all duration-150 relative overflow-hidden"
    :class="
      isFocused
        ? 'border-blue-400 ring-2 ring-blue-100 shadow-md'
        : 'border-slate-200 hover:border-blue-300 hover:shadow-sm hover:-translate-y-[1px]'
    "
    @mousedown="onMousedown">
    <div class="flex items-center gap-2 mb-1 opacity-90">
      <span class="text-[10px] font-bold text-red-600 uppercase tracking-widest">{{ article.category }}</span>
      <span class="text-xs text-slate-500 font-medium">{{ timeStr }}</span>
    </div>

    <div class="flex items-start justify-between gap-4">
      <div class="block text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-700">
        {{ article.heading }}
      </div>
      <a
        :href="article.url"
        target="_blank"
        class="text-slate-400 hover:text-blue-600 transition-colors shrink-0"
        title="Åbn original artikel (Enter/Space)"
        @mousedown.stop
        @click="store.trackEvent('open_url', article.url)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    </div>

    <div
      v-if="mode !== 'hidden' && isFocused"
      class="article-summary mt-2.5 pt-2.5 border-t border-slate-100 text-sm text-slate-700 leading-relaxed bg-slate-50/50 -mx-3 -mb-2.5 px-3 py-2.5">
      {{ summaryStr }}
    </div>

    <!-- Actions Menu Overlay -->
    <div
      v-if="mode === 'actions' && isFocused"
      class="article-actions absolute inset-0 bg-slate-900/95 backdrop-blur-sm shadow-xl flex items-center justify-center p-4 z-10">
      <div class="flex gap-4">
        <a
          :href="article.url"
          target="_blank"
          @click="store.trackEvent('open_url', article.url)"
          class="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-colors shadow-lg"
          >Åbn</a
        >
        <button
          class="px-4 py-2 bg-slate-800 text-white font-medium rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors shadow-lg">
          Del
        </button>
        <button
          class="px-4 py-2 bg-slate-800 text-white font-medium rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors shadow-lg">
          Gem
        </button>
        <button
          class="px-4 py-2 bg-slate-800 text-white font-medium rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors shadow-lg">
          Luk (Venstrepil)
        </button>
      </div>
    </div>
  </article>
</template>
