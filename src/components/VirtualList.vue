<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
  containerHeight: number
  totalHeight: number
  visibleItems: VirtualItem[]
  isLoadingMore: boolean
}>()

const emit = defineEmits<{
  scroll: [event: Event]
  measureItem: [id: number, element: HTMLElement]
}>()

const { containerHeight, totalHeight } = toRefs(props)

function handleMeasure(id: number, el: unknown) {
  if (el) {
    emit('measureItem', id, el as HTMLElement)
  }
}
</script>

<template>
  <div
    class="scroll-container"
    @scroll="emit('scroll', $event)"
    :style="{ height: containerHeight + 'px' }"
  >
    <div class="scroll-content" :style="{ height: totalHeight + 'px' }">
      <div
        v-for="item in visibleItems"
        :key="item.id"
        :ref="(el) => handleMeasure(item.id, el)"
        class="item"
        :style="{
          position: 'absolute',
          top: item.top + 'px',
          left: 0,
          right: 0,
          minHeight: item.height + 'px',
        }"
      >
        <div class="item-content">
          <div class="item-header">
            <span class="item-id">#{{ item.id }}</span>
            <span>{{ item.timestamp.toLocaleTimeString() }}</span>
          </div>
          <div>{{ item.text }}</div>
        </div>
      </div>
    </div>

    <div v-if="isLoadingMore" class="loading-more">Загрузка...</div>
  </div>
</template>

<style scoped>
.scroll-container {
  border: 2px solid #ddd;
  border-radius: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

.scroll-content {
  position: relative;
  width: 100%;
}

.item {
  border-bottom: 1px solid #e9ecef;
  box-sizing: border-box;
}

.item-content {
  padding: 12px 16px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.item-id {
  font-weight: bold;
  font-size: 0.9em;
}

.loading-more {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 4px;
  font-size: 0.85em;
}
</style>
