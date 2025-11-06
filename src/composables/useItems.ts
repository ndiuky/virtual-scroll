import { ref } from 'vue'
import { TOTAL_ITEMS } from '../const'

export function useItems() {
  const items = ref<Item[]>([])
  const renderTime = ref<number>(0)
  const memoryUsage = ref<string>('0')

  function generateItems(): void {
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
  }

  return {
    items,
    renderTime,
    memoryUsage,
    generateItems,
  }
}
