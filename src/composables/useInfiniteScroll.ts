import { ref } from 'vue'
import type { Ref } from 'vue'

export function useInfiniteScroll(
  loadMore: () => Promise<void>,
  hasMore: Ref<boolean>,
  threshold = 200,
) {
  const isLoadingMore = ref<boolean>(false)

  async function handleScroll(e: Event): Promise<void> {
    const target = e.target as HTMLElement
    const scrollTop = target.scrollTop
    const scrollHeight = target.scrollHeight
    const clientHeight = target.clientHeight

    const distanceToBottom = scrollHeight - scrollTop - clientHeight

    if (distanceToBottom < threshold && hasMore.value && !isLoadingMore.value) {
      isLoadingMore.value = true
      try {
        await loadMore()
      } finally {
        isLoadingMore.value = false
      }
    }
  }

  return {
    isLoadingMore,
    handleScroll,
  }
}
