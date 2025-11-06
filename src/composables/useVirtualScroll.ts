import type { Ref } from 'vue'
import { ref, computed, nextTick, watch } from 'vue'
import { useSettings } from './useSettings'

export function useVirtualScroll(items: Ref<Item[]>) {
  const { settings } = useSettings()
  const scrollTop = ref<number>(0)
  const itemHeights = ref<Map<number, number>>(new Map())
  const itemPositions = ref<ItemPosition[]>([])
  const containerRef = ref<HTMLElement | null>(null)
  const renderedChunks = ref<Set<number>>(new Set())
  const lastVisibleRange = ref<{ start: number; end: number }>({ start: 0, end: 0 })

  function updatePositions(): void {
    let currentTop = 0
    const positions: ItemPosition[] = []

    for (let i = 0; i < items.value.length; i++) {
      const height = itemHeights.value.get(i) || settings.defaultItemHeight
      positions.push({
        index: i,
        top: currentTop,
        height,
      })
      currentTop += height
    }

    itemPositions.value = positions
  }

  function cleanupOldHeights(startIndex: number, endIndex: number): void {
    const keysToDelete: number[] = []

    itemHeights.value.forEach((_, index) => {
      if (
        index < startIndex - settings.maxRenderedItems ||
        index > endIndex + settings.maxRenderedItems
      ) {
        keysToDelete.push(index)
      }
    })

    keysToDelete.forEach((key) => {
      itemHeights.value.delete(key)
    })
  }

  function measureItem(index: number, element: HTMLElement): void {
    const height = element.offsetHeight
    const previousHeight = itemHeights.value.get(index)

    if (previousHeight !== height) {
      itemHeights.value.set(index, height)
      updatePositions()
    }
  }

  const totalHeight = computed(() => {
    if (itemPositions.value.length === 0) {
      return items.value.length * settings.defaultItemHeight
    }
    const lastPosition = itemPositions.value[itemPositions.value.length - 1]
    return lastPosition ? lastPosition.top + lastPosition.height : 0
  })

  const visibleItems = computed(() => {
    if (itemPositions.value.length === 0) {
      const count = Math.min(
        Math.ceil(settings.containerHeight / settings.defaultItemHeight) + settings.buffer * 2,
        settings.maxRenderedItems,
      )
      return items.value.slice(0, count).map((item, idx) => ({
        ...item,
        top: idx * settings.defaultItemHeight,
        height: settings.defaultItemHeight,
      })) as VirtualItem[]
    }

    const start = scrollTop.value
    const end = scrollTop.value + settings.containerHeight

    let startIndex = itemPositions.value.findIndex(
      (pos) => pos.top + pos.height >= start - settings.buffer * settings.defaultItemHeight,
    )
    if (startIndex === -1) startIndex = 0

    let endIndex = itemPositions.value.findIndex(
      (pos) => pos.top > end + settings.buffer * settings.defaultItemHeight,
    )
    if (endIndex === -1) endIndex = itemPositions.value.length

    const totalVisible = endIndex - startIndex
    if (totalVisible > settings.maxRenderedItems) {
      endIndex = startIndex + settings.maxRenderedItems
    }

    if (
      Math.abs(lastVisibleRange.value.start - startIndex) > settings.maxRenderedItems ||
      Math.abs(lastVisibleRange.value.end - endIndex) > settings.maxRenderedItems
    ) {
      cleanupOldHeights(startIndex, endIndex)
    }

    lastVisibleRange.value = { start: startIndex, end: endIndex }

    const visibleSlice = itemPositions.value.slice(startIndex, endIndex)

    return visibleSlice.map((pos) => ({
      ...items.value[pos.index],
      top: pos.top,
      height: pos.height,
    })) as VirtualItem[]
  })

  const renderStats = computed(() => ({
    renderedItems: visibleItems.value.length,
    cachedHeights: itemHeights.value.size,
    totalPositions: itemPositions.value.length,
  }))

  function handleScroll(e: Event): void {
    const target = e.target as HTMLElement
    scrollTop.value = target.scrollTop
  }

  async function initializePositions(): Promise<void> {
    await nextTick()
    updatePositions()
  }

  function clearCache(): void {
    itemHeights.value.clear()
    renderedChunks.value.clear()
    lastVisibleRange.value = { start: 0, end: 0 }
  }

  watch(
    () => items.value.length,
    (newLength, oldLength) => {
      if (newLength < oldLength) {
        clearCache()
      }
    },
  )

  return {
    scrollTop,
    visibleItems,
    totalHeight,
    containerRef,
    itemPositions,
    renderStats,
    handleScroll,
    measureItem,
    initializePositions,
    clearCache,
  }
}
