import { ref, computed, type Ref } from 'vue'
import { ITEM_HEIGHT, CONTAINER_HEIGHT, BUFFER } from '@/const'

export function useVirtualScroll(items: Ref<Item[]>) {
  const useVirtualScroll = ref<boolean>(false)
  const scrollTop = ref<number>(0)

  const visibleItems = computed(() => {
    if (!useVirtualScroll.value) {
      return items.value
    }

    const startIndex = Math.max(0, Math.floor(scrollTop.value / ITEM_HEIGHT) - BUFFER)
    const endIndex = Math.min(
      items.value.length,
      Math.ceil((scrollTop.value + CONTAINER_HEIGHT) / ITEM_HEIGHT) + BUFFER,
    )

    return items.value.slice(startIndex, endIndex).map((item: Item, idx: number) => ({
      ...item,
      top: (startIndex + idx) * ITEM_HEIGHT,
    })) as VirtualItem[]
  })

  function handleScroll(e: Event): void {
    if (useVirtualScroll.value) {
      scrollTop.value = (e.target as HTMLElement).scrollTop
    }
  }

  return {
    useVirtualScroll,
    scrollTop,
    visibleItems,
    handleScroll,
  }
}
