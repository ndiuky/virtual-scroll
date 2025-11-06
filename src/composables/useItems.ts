import { ref } from 'vue'
import { TOTAL_ITEMS, ITEMS_PER_PAGE, INITIAL_ITEMS } from '@/const'
import { indexedDBService } from '@/utils'
import { getRandomItemsArray } from '@/utils/helpers'

export function useItems() {
  const items = ref<Item[]>([])
  const renderTime = ref<number>(0)
  const memoryUsage = ref<string>('0')
  const isLoading = ref<boolean>(false)
  const currentPage = ref<number>(0)
  const hasMore = ref<boolean>(true)

  function generateItemsBatch(startIndex: number, count: number): Item[] {
    const newItems: Item[] = []

    for (let i = startIndex; i < startIndex + count && i < TOTAL_ITEMS; i++) {
      const texts: [string, string, string] = getRandomItemsArray(i)
      const randomTextIndex = Math.floor(Math.random() * texts.length)

      newItems.push({
        id: i,
        text: texts[randomTextIndex] || texts[0],
        timestamp: new Date(Date.now() - Math.random() * 10000000000),
      })
    }

    return newItems
  }

  async function generateItems(): Promise<void> {
    const startTime = performance.now()
    const newItems = generateItemsBatch(0, INITIAL_ITEMS)

    items.value = newItems
    currentPage.value = 1
    hasMore.value = newItems.length < TOTAL_ITEMS
    renderTime.value = performance.now() - startTime
    memoryUsage.value = (JSON.stringify(items.value).length / 1024 / 1024).toFixed(2)

    indexedDBService.saveItems(newItems)
  }

  async function loadMore(): Promise<void> {
    if (!hasMore.value) return

    const startIndex = currentPage.value * ITEMS_PER_PAGE
    const newBatch = generateItemsBatch(startIndex, ITEMS_PER_PAGE)

    if (newBatch.length === 0) {
      hasMore.value = false
      return
    }

    items.value = [...items.value, ...newBatch]
    currentPage.value++
    hasMore.value = items.value.length < TOTAL_ITEMS

    indexedDBService.saveItems(items.value)
  }

  async function loadItems(): Promise<void> {
    isLoading.value = true
    try {
      const startTime = performance.now()
      const loadedItems = await indexedDBService.getItems()

      if (loadedItems.length > 0) {
        const initialBatch = loadedItems.slice(0, INITIAL_ITEMS)
        items.value = initialBatch
        renderTime.value = performance.now() - startTime

        setTimeout(() => {
          items.value = loadedItems
          currentPage.value = Math.ceil(loadedItems.length / ITEMS_PER_PAGE)
          hasMore.value = loadedItems.length < TOTAL_ITEMS
          memoryUsage.value = (JSON.stringify(items.value).length / 1024 / 1024).toFixed(2)
        }, 0)
      }
    } finally {
      isLoading.value = false
    }
  }

  async function initItems(): Promise<void> {
    await indexedDBService.init()
    const hasData = await indexedDBService.hasItems()

    if (hasData) {
      await loadItems()
    } else {
      await generateItems()
    }
  }

  async function clearAndRegenerate(): Promise<void> {
    await indexedDBService.clearItems()
    await generateItems()
  }

  async function loadUpToIndex(targetIndex: number): Promise<void> {
    if (targetIndex < 0 || targetIndex >= TOTAL_ITEMS) return

    if (targetIndex < items.value.length) return

    const itemsNeeded = targetIndex + 1 - items.value.length
    const batchesToLoad = Math.ceil(itemsNeeded / ITEMS_PER_PAGE)

    for (let i = 0; i < batchesToLoad && hasMore.value; i++) {
      await loadMore()
    }
  }

  return {
    items,
    renderTime,
    memoryUsage,
    isLoading,
    hasMore,
    generateItems,
    loadItems,
    loadMore,
    loadUpToIndex,
    initItems,
    clearAndRegenerate,
  }
}
