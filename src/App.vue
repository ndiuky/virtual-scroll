<script setup lang="ts">
import { onMounted, watch } from 'vue'
import {
  useItems,
  useVirtualScroll,
  useInfiniteScroll,
  useScrollJump,
  useNavigation,
} from '@/composables'
import { CONTAINER_HEIGHT, INFINITE_SCROLL_THRESHOLD, TOTAL_ITEMS } from '@/const'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import ControlPanel from '@/components/ControlPanel.vue'
import NavigationPanel from '@/components/NavigationPanel.vue'
import StatsDisplay from '@/components/StatsDisplay.vue'
import VirtualList from '@/components/VirtualList.vue'

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
  INFINITE_SCROLL_THRESHOLD,
)

const { jumpToIndex } = useScrollJump(containerRef, totalHeight)

const { showJumpPanel, toggleNavigation, handleJumpToItem, quickJump } = useNavigation({
  isLoading,
  loadUpToIndex,
  initializePositions,
  itemPositions,
  jumpToIndex,
  totalItems: TOTAL_ITEMS,
})

async function onScroll(e: Event) {
  handleVirtualScroll(e)
  await handleInfiniteScroll(e)
}

async function handleRegenerate() {
  clearCache()
  await clearAndRegenerate()
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
    <h1 class="heading">Демонстрация Virtual Scroll</h1>

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
      :container-height="CONTAINER_HEIGHT"
      :total-height="totalHeight"
      :visible-items="visibleItems"
      :is-loading-more="isLoadingMore"
      @scroll="onScroll"
      @measure-item="measureItem"
    />
  </div>
</template>

<style scoped>
.app {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.heading {
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 2rem;
}
</style>
