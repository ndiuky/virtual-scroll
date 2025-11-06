<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  quickJump: [position: 'start' | 'middle' | 'end']
  jumpToItem: [itemId: number]
}>()

const jumpToItemId = ref('')

function handleJumpToItem() {
  const targetId = parseInt(jumpToItemId.value)
  if (!isNaN(targetId)) {
    emit('jumpToItem', targetId)
    jumpToItemId.value = ''
  }
}
</script>

<template>
  <div class="navigation-panel">
    <div class="quick-jump">
      <button @click="emit('quickJump', 'start')">В начало</button>
      <button @click="emit('quickJump', 'middle')">В середину</button>
      <button @click="emit('quickJump', 'end')">В конец</button>
    </div>
    <div class="jump-to-item">
      <input
        v-model="jumpToItemId"
        type="number"
        placeholder="Номер элемента"
        @keyup.enter="handleJumpToItem"
      />
      <button @click="handleJumpToItem">Перейти</button>
    </div>
  </div>
</template>

<style scoped>
.navigation-panel {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.quick-jump {
  margin-bottom: 10px;
}

.quick-jump button {
  margin-right: 10px;
}

.jump-to-item {
  display: flex;
  gap: 10px;
}

.jump-to-item input {
  flex: 1;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
