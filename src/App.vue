<script setup lang="ts">
import { onMounted } from 'vue'
import { useItems } from './composables/useItems'
import { useVirtualScroll } from './composables/useVirtualScroll'
const { items, generateItems } = useItems()
const { visibleItems, handleScroll } = useVirtualScroll(items)

onMounted(() => {
  generateItems()
})
</script>

<template class="app">
  <h1 class="heading">Демонстрация Virtual Scroll</h1>

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
</style>
