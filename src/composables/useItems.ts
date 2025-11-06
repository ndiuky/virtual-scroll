import { ref } from 'vue'
import { TOTAL_ITEMS } from '@/const'
import { indexedDBService } from '@/utils'

export function useItems() {
  const items = ref<Item[]>([])
  const renderTime = ref<number>(0)
  const memoryUsage = ref<string>('0')
  const isLoading = ref<boolean>(false)

  async function generateItems(): Promise<void> {
    const startTime = performance.now()
    const newItems: Item[] = []

    for (let i = 0; i < TOTAL_ITEMS; i++) {
      newItems.push({
        id: i,
        text: `Сообщение #${i} - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.`,
        timestamp: new Date(Date.now() - Math.random() * 10000000000),
      })
    }

    items.value = newItems
    renderTime.value = performance.now() - startTime
    memoryUsage.value = (JSON.stringify(items.value).length / 1024 / 1024).toFixed(2)

    await indexedDBService.saveItems(newItems)
  }

  async function loadItems(): Promise<void> {
    isLoading.value = true
    try {
      const startTime = performance.now()
      const loadedItems = await indexedDBService.getItems()

      if (loadedItems.length > 0) {
        items.value = loadedItems
        renderTime.value = performance.now() - startTime
        memoryUsage.value = (JSON.stringify(items.value).length / 1024 / 1024).toFixed(2)
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

  return {
    items,
    renderTime,
    memoryUsage,
    isLoading,
    generateItems,
    loadItems,
    initItems,
    clearAndRegenerate,
  }
}
