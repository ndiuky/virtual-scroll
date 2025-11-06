<script setup lang="ts">
import { onMounted } from 'vue'
import { useItems, useVirtualScroll } from '@/composables'

const { items, isLoading, initItems, clearAndRegenerate } = useItems()
const { visibleItems, handleScroll } = useVirtualScroll(items)

onMounted(async () => {
  await initItems()
})
</script>

<template class="app">
  <h1 class="heading">Демонстрация Virtual Scroll</h1>

  <div v-if="isLoading" class="loading">ЗагрузОчка из дбшки</div>

  <div class="controls">
    <button @click="clearAndRegenerate" class="regenerate-btn">Обновить нах</button>
  </div>

  <div class="scroll-container" @scroll="handleScroll">
    <div class="scroll-content">
      <div v-for="item in visibleItems" :key="item.id" class="item">
        <div class="item-content">
          <div class="item-header">
            <span class="item-id">#{{ item.id }}</span>
            <span>{{ item.timestamp.toLocaleTimeString() }}</span>
          </div>
          <div class="item-text">{{ item.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.heading {
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.scroll-container {
  border: 2px solid #ddd;
  border-radius: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

.scroll-content {
  position: relative;
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

.loading {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  color: #666;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.regenerate-btn {
  padding: 10px 20px;
  font-size: 1em;
}
</style>
