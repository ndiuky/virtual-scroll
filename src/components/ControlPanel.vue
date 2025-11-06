<script setup lang="ts">
const emit = defineEmits<{
  regenerate: []
  toggleNavigation: []
}>()

defineProps<{
  showNavigation: boolean
}>()
</script>

<template>
  <div class="controls">
    <button @click="emit('regenerate')">Обновить</button>
    <button @click="emit('toggleNavigation')">
      {{ showNavigation ? 'Скрыть' : 'Навигация' }}
    </button>
  </div>
</template>

<style scoped>
.controls {
  margin-bottom: 15px;
}

.controls button {
  margin-right: 10px;
}
</style>
