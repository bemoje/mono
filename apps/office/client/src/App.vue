<script setup lang="ts">
import { useArticleStore } from './stores/articleStore'
import { storeToRefs } from 'pinia'

const store = useArticleStore()
const { articles, currentIndex, articleRefs } = storeToRefs(store)

const { setFocus, resetHiddenArticles } = store

import { useSettingsStore } from './stores/settings'
import ArticleItem from './components/ArticleItem.vue'
const settingsStore = useSettingsStore()

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
articleRefs // used in template ref

function onMousedown(event: MouseEvent, index: number) {
  if ((event.target as HTMLElement).tagName !== 'A') {
    if (currentIndex.value === index) {
      setFocus(-1)
    } else {
      setFocus(index)
    }
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8 pb-[60vh] font-sans antialiased text-slate-900 selection:bg-blue-200">
    <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
      <h1 class="text-3xl font-black tracking-tight text-slate-900 uppercase">DR.DK Nyheder</h1>
      <div class="flex items-center gap-3">
        <a
          href="http://127.0.0.1:4983"
          target="_blank"
          class="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >DB Studio</a
        >
        <a
          href="http://localhost:5173/api/graphql"
          target="_blank"
          class="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >GraphQL</a
        >
        <button
          @click="resetHiddenArticles"
          class="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
          title="Gendan skjulte artikler">
          Gendan skjulte
        </button>
        <button
          @click="settingsStore.toggleSettings"
          class="p-2 text-slate-600 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
          title="Indstillinger">
          ⚙️
        </button>
      </div>
    </div>

    <!-- Settings Overlay -->
    <div
      v-if="settingsStore.showSettings"
      class="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm"
      @click.self="settingsStore.toggleSettings">
      <div class="w-80 bg-white h-full shadow-2xl p-6 flex flex-col gap-6" @click.stop>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-900">Indstillinger</h2>
          <button @click="settingsStore.toggleSettings" class="text-slate-400 hover:text-slate-900">✕</button>
        </div>

        <div class="flex flex-col gap-4">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              v-model="settingsStore.themeMode"
              class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
            <span class="text-sm font-medium text-slate-700">Mørk tilstand</span>
          </label>
        </div>

        <div class="flex flex-col gap-4">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              v-model="settingsStore.autoHideRead"
              class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
            <span class="text-sm font-medium text-slate-700">Skjul læste artikler auto</span>
          </label>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <ArticleItem
        v-for="(a, index) in articles"
        :key="a.id"
        :article="a"
        :index="index"
        :isFocused="currentIndex === index"
        ref="articleRefs"
        @mousedown="onMousedown" />
    </div>
  </div>
</template>

<style>
@font-face {
  font-family: 'Publik';
  src: url('https://www.dr.dk/global/fonts/DRPublikUIVF-b49db5333dbc736c65cec4e56338975e.woff2') format('woff2');
  font-weight: 300 700;
  font-stretch: 50% 100%;
  font-display: swap;
}
body {
  font-family: Publik, ui-sans-serif, system-ui, sans-serif;
  background-color: #f8fafc; /* tailwind slate-50 */
}
</style>
