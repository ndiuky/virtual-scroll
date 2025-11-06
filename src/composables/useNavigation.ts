import { ref } from 'vue'
import type { Ref } from 'vue'

interface UseNavigationOptions {
  isLoading: Ref<boolean>
  loadUpToIndex: (index: number) => Promise<void>
  initializePositions: () => Promise<void>
  itemPositions: Ref<ItemPosition[]>
  jumpToIndex: (index: number, positions: ItemPosition[]) => void
  totalItems: number
}

export function useNavigation({
  isLoading,
  loadUpToIndex,
  initializePositions,
  itemPositions,
  jumpToIndex,
  totalItems,
}: UseNavigationOptions) {
  const showJumpPanel = ref(false)

  function toggleNavigation() {
    showJumpPanel.value = !showJumpPanel.value
  }

  function closeNavigation() {
    showJumpPanel.value = false
  }

  async function handleJumpToItem(targetId: number) {
    if (targetId < 0 || targetId >= totalItems) {
      alert(`Введите номер от 0 до ${(totalItems - 1).toLocaleString()}`)
      return
    }

    isLoading.value = true

    try {
      await loadUpToIndex(targetId)
      await initializePositions()

      if (itemPositions.value[targetId]) {
        jumpToIndex(targetId, itemPositions.value)
        closeNavigation()
      }
    } finally {
      isLoading.value = false
    }
  }

  async function quickJump(position: 'start' | 'middle' | 'end') {
    isLoading.value = true

    try {
      let targetIndex = 0

      switch (position) {
        case 'start':
          targetIndex = 0
          break
        case 'middle':
          targetIndex = Math.floor(totalItems / 2)
          break
        case 'end':
          targetIndex = totalItems - 1
          break
      }

      await loadUpToIndex(targetIndex)
      await initializePositions()

      if (itemPositions.value[targetIndex]) {
        jumpToIndex(targetIndex, itemPositions.value)
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    showJumpPanel,
    toggleNavigation,
    closeNavigation,
    handleJumpToItem,
    quickJump,
  }
}
