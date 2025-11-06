<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
import {
  useItems,
  useVirtualScroll,
  useInfiniteScroll,
  useScrollJump,
  useNavigation,
  useSettings,
} from '@/composables'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import ControlPanel from '@/components/ControlPanel.vue'
import NavigationPanel from '@/components/NavigationPanel.vue'
import StatsDisplay from '@/components/StatsDisplay.vue'
import VirtualList from '@/components/VirtualList.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'

import type { VirtualScrollSettings } from '@/composables/useSettings'

const {
  settings,
  showSettings,
  toggleSettings,
  closeSettings,
  updateSettings,
  resetSettings,
  defaultSettings,
} = useSettings()

const containerHeight = computed(() => settings.containerHeight)
const infiniteScrollThreshold = computed(() => settings.infiniteScrollThreshold)
const totalItems = computed(() => settings.totalItems)

const { items, isLoading, hasMore, initItems, clearAndRegenerate, loadMore, loadUpToIndex } =
  useItems()

const {
  visibleItems,
  totalHeight,
  containerRef,
  itemPositions,
  renderStats,
  handleScroll: handleVirtualScroll,
  measureItem,
  initializePositions,
  clearCache,
} = useVirtualScroll(items)

const { isLoadingMore, handleScroll: handleInfiniteScroll } = useInfiniteScroll(
  loadMore,
  hasMore,
  infiniteScrollThreshold.value,
)

const { jumpToIndex } = useScrollJump(containerRef, totalHeight)

const { showJumpPanel, toggleNavigation, handleJumpToItem, quickJump } = useNavigation({
  isLoading,
  loadUpToIndex,
  initializePositions,
  itemPositions,
  jumpToIndex,
  totalItems: totalItems.value,
})

async function onScroll(e: Event) {
  handleVirtualScroll(e)
  await handleInfiniteScroll(e)
}

async function handleRegenerate() {
  clearCache()
  await clearAndRegenerate()
}

function handleSettingsUpdate(newSettings: Partial<VirtualScrollSettings>) {
  updateSettings(newSettings)
  handleRegenerate()
}

function handleSettingsReset() {
  resetSettings()
  handleRegenerate()
}

watch(
  () => items.value.length,
  () => {
    requestAnimationFrame(() => {
      initializePositions()
    })
  },
)

onMounted(async () => {
  await initItems()
  requestAnimationFrame(() => {
    initializePositions()
  })
})
</script>

<template>
  <div class="app">
    <div class="app-header">
      <h1 class="heading">Демонстрация Virtual Scroll</h1>
      <button class="settings-btn" @click="toggleSettings">⚙️ Настройки</button>
    </div>

    <LoadingIndicator :is-loading="isLoading" />

    <ControlPanel
      :show-navigation="showJumpPanel"
      @regenerate="handleRegenerate"
      @toggle-navigation="toggleNavigation"
    />

    <NavigationPanel
      v-if="showJumpPanel"
      @quick-jump="quickJump"
      @jump-to-item="handleJumpToItem"
    />

    <StatsDisplay
      :total-items="items.length"
      :visible-items="visibleItems.length"
      :cached-heights="renderStats.cachedHeights"
    />

    <VirtualList
      ref="containerRef"
      :container-height="containerHeight"
      :total-height="totalHeight"
      :visible-items="visibleItems"
      :is-loading-more="isLoadingMore"
      @scroll="onScroll"
      @measure-item="measureItem"
    />

    <SettingsPanel
      v-if="showSettings"
      :settings="settings"
      :default-settings="defaultSettings"
      @update="handleSettingsUpdate"
      @reset="handleSettingsReset"
      @close="closeSettings"
    />
  </div>
</template>

<style scoped>
.app {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.heading {
  text-align: center;
  margin: 1rem 0;
  flex: 1;
}

.settings-btn {
  background: #f0f0f0;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.settings-btn:hover {
  background: #e0e0e0;
}
</style>
