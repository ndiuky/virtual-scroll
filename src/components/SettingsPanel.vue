<script setup lang="ts">
import { ref, computed } from 'vue'
import type { VirtualScrollSettings } from '@/composables/useSettings'

const props = defineProps<{
  settings: VirtualScrollSettings
  defaultSettings: VirtualScrollSettings
}>()

const emit = defineEmits<{
  update: [settings: Partial<VirtualScrollSettings>]
  reset: []
  close: []
}>()

const localSettings = ref<VirtualScrollSettings>({ ...props.settings })

const isDirty = computed(() => {
  return JSON.stringify(localSettings.value) !== JSON.stringify(props.settings)
})

function handleSave() {
  emit('update', localSettings.value)
  emit('close')
}

function handleReset() {
  localSettings.value = { ...props.defaultSettings }
  emit('reset')
}

function handleCancel() {
  localSettings.value = { ...props.settings }
  emit('close')
}
</script>

<template>
  <div class="settings-panel">
    <div class="settings-overlay" @click="handleCancel"></div>
    <div class="settings-content">
      <div class="settings-header">
        <h2>Настройки скролла</h2>
        <button class="close-btn" @click="handleCancel">✕</button>
      </div>

      <div class="settings-body">
        <div class="setting-group">
          <label>
            <span class="label-text">Всего элементов</span>
            <input v-model.number="localSettings.totalItems" type="number" min="100" step="1000" />
          </label>
        </div>

        <div class="setting-group">
          <label>
            <span class="label-text">Начальная загрузка</span>
            <input v-model.number="localSettings.initialItems" type="number" min="10" step="100" />
          </label>
        </div>

        <div class="setting-group">
          <label>
            <span class="label-text">Элементов на страницу</span>
            <input v-model.number="localSettings.itemsPerPage" type="number" min="10" step="10" />
          </label>
        </div>

        <div class="setting-group">
          <label>
            <span class="label-text">Высота элемента (px)</span>
            <input
              v-model.number="localSettings.defaultItemHeight"
              type="number"
              min="20"
              step="10"
            />
          </label>
        </div>

        <div class="setting-group">
          <label>
            <span class="label-text">Высота контейнера (px)</span>
            <input
              v-model.number="localSettings.containerHeight"
              type="number"
              min="200"
              step="50"
            />
          </label>
        </div>

        <div class="setting-group">
          <label>
            <span class="label-text">Макс. отрисованных элементов</span>
            <input
              v-model.number="localSettings.maxRenderedItems"
              type="number"
              min="10"
              step="5"
            />
          </label>
        </div>

        <div class="setting-group">
          <label>
            <span class="label-text">Буфер</span>
            <input v-model.number="localSettings.buffer" type="number" min="0" step="1" />
          </label>
        </div>
        <div class="setting-group">
          <label>
            <span class="label-text">Порог бесконечного скролла (px)</span>
            <input
              v-model.number="localSettings.infiniteScrollThreshold"
              type="number"
              min="100"
              step="50"
            />
          </label>
        </div>
      </div>

      <div class="settings-footer">
        <button class="btn btn-secondary" @click="handleReset">Сбросить</button>
        <div class="btn-group">
          <button class="btn btn-cancel" @click="handleCancel">Отмена</button>
          <button class="btn btn-primary" :disabled="!isDirty" @click="handleSave">
            Применить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.settings-content {
  position: relative;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.settings-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f0f0f0;
}

.settings-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.setting-group {
  margin-bottom: 20px;
}

.setting-group label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label-text {
  font-weight: 500;
  color: #333;
}

.setting-group input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.setting-group input:focus {
  outline: none;
  border-color: #4a90e2;
}

.setting-group small {
  color: #666;
  font-size: 0.875rem;
  margin-top: -4px;
}

.settings-footer {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn-group {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #4a90e2;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #357abd;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-cancel {
  background: white;
  color: #666;
  border: 1px solid #ddd;
}

.btn-cancel:hover {
  background: #f9f9f9;
}
</style>
