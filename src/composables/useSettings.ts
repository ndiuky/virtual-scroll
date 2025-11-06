import { ref, reactive, watch } from 'vue'

export interface VirtualScrollSettings {
  totalItems: number
  defaultItemHeight: number
  containerHeight: number
  buffer: number
  maxRenderedItems: number
  infiniteScrollThreshold: number
  itemsPerPage: number
  initialItems: number
}

const STORAGE_KEY = 'virtual-scroll-settings'

const defaultSettings: VirtualScrollSettings = {
  totalItems: 1000000,
  defaultItemHeight: 80,
  containerHeight: 600,
  buffer: 2,
  maxRenderedItems: 30,
  infiniteScrollThreshold: 300,
  itemsPerPage: 50,
  initialItems: 10000,
}

function loadSettings(): VirtualScrollSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
  return { ...defaultSettings }
}

function saveSettings(settings: VirtualScrollSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
}

const settings = reactive<VirtualScrollSettings>(loadSettings())

export function useSettings() {
  const showSettings = ref(false)

  function toggleSettings() {
    showSettings.value = !showSettings.value
  }

  function closeSettings() {
    showSettings.value = false
  }

  function updateSettings(newSettings: Partial<VirtualScrollSettings>) {
    Object.assign(settings, newSettings)
    saveSettings(settings)
  }

  function resetSettings() {
    Object.assign(settings, defaultSettings)
    saveSettings(settings)
  }

  watch(settings, () => {
    saveSettings(settings)
  })

  return {
    settings,
    showSettings,
    toggleSettings,
    closeSettings,
    updateSettings,
    resetSettings,
    defaultSettings,
  }
}
