import type { Ref } from 'vue'
import { ref, computed, nextTick, watch } from 'vue'
import { DEFAULT_ITEM_HEIGHT, CONTAINER_HEIGHT, BUFFER, MAX_RENDERED_ITEMS } from '@/const'

export function useVirtualScroll(items: Ref<Item[]>) {
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
      const height = itemHeights.value.get(i) || DEFAULT_ITEM_HEIGHT
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
      if (index < startIndex - MAX_RENDERED_ITEMS || index > endIndex + MAX_RENDERED_ITEMS) {
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
      return items.value.length * DEFAULT_ITEM_HEIGHT
    }
    const lastPosition = itemPositions.value[itemPositions.value.length - 1]
    return lastPosition ? lastPosition.top + lastPosition.height : 0
  })

  const visibleItems = computed(() => {
    if (itemPositions.value.length === 0) {
      const count = Math.min(
        Math.ceil(CONTAINER_HEIGHT / DEFAULT_ITEM_HEIGHT) + BUFFER * 2,
        MAX_RENDERED_ITEMS,
      )
      return items.value.slice(0, count).map((item, idx) => ({
        ...item,
        top: idx * DEFAULT_ITEM_HEIGHT,
        height: DEFAULT_ITEM_HEIGHT,
      })) as VirtualItem[]
    }

    const start = scrollTop.value
    const end = scrollTop.value + CONTAINER_HEIGHT

    let startIndex = itemPositions.value.findIndex(
      (pos) => pos.top + pos.height >= start - BUFFER * DEFAULT_ITEM_HEIGHT,
    )
    if (startIndex === -1) startIndex = 0

    let endIndex = itemPositions.value.findIndex(
      (pos) => pos.top > end + BUFFER * DEFAULT_ITEM_HEIGHT,
    )
    if (endIndex === -1) endIndex = itemPositions.value.length

    const totalVisible = endIndex - startIndex
    if (totalVisible > MAX_RENDERED_ITEMS) {
      endIndex = startIndex + MAX_RENDERED_ITEMS
    }

    if (
      Math.abs(lastVisibleRange.value.start - startIndex) > MAX_RENDERED_ITEMS ||
      Math.abs(lastVisibleRange.value.end - endIndex) > MAX_RENDERED_ITEMS
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
