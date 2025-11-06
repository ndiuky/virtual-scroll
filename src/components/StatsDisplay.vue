<script setup lang="ts">
defineProps<{
  totalItems: number
  visibleItems: number
  cachedHeights: number
}>()
</script>

<template>
  <div class="stats">
    Всего: {{ totalItems }} | Видимых: {{ visibleItems }} | В кеше: {{ cachedHeights }}
  </div>
</template>

<style scoped>
.stats {
  margin-bottom: 15px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>
