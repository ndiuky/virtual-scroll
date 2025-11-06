import { ref } from 'vue'
import type { Ref } from 'vue'

export function useScrollJump(containerRef: Ref<HTMLElement | null>, totalHeight: Ref<number>) {
  const isJumping = ref<boolean>(false)
  const targetScrollTop = ref<number>(0)

  function jumpToPosition(ratio: number): void {
    if (!containerRef.value) return

    const targetPosition = totalHeight.value * ratio
    isJumping.value = true
    targetScrollTop.value = targetPosition

    containerRef.value.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    })

    setTimeout(() => {
      isJumping.value = false
    }, 500)
  }

  function jumpToIndex(index: number, itemPositions: ItemPosition[]): void {
    if (!containerRef.value || index < 0 || index >= itemPositions.length) return

    const position = itemPositions[index]
    if (!position) return

    isJumping.value = true
    targetScrollTop.value = position.top

    containerRef.value.scrollTo({
      top: position.top,
      behavior: 'smooth',
    })

    setTimeout(() => {
      isJumping.value = false
    }, 500)
  }

  return {
    isJumping,
    targetScrollTop,
    jumpToPosition,
    jumpToIndex,
  }
}
