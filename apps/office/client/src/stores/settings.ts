import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export const useSettingsStore = defineStore('settings', () => {
  const showSettings = ref(false)

  // Settings
  const themeMode = useLocalStorage<'light' | 'dark'>('settings.themeMode', 'light')
  const autoHideRead = useLocalStorage<boolean>('settings.autoHideRead', false)

  function toggleSettings() {
    showSettings.value = !showSettings.value
  }

  return {
    showSettings,
    themeMode,
    autoHideRead,
    toggleSettings,
  }
})
