<script setup lang="ts">
defineProps<{
  isLoading: boolean
}>()
</script>

<template>
  <div v-if="isLoading" class="loading">Загрузка...</div>
</template>

<style scoped>
.loading {
  text-align: center;
  padding: 10px;
  color: #666;
}
</style>
