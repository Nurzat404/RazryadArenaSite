<script setup lang="ts">
interface BaseTabItem {
  label: string
  value: string
  disabled?: boolean
}

withDefaults(defineProps<{
  modelValue: string
  tabs: BaseTabItem[]
  ariaLabel?: string
}>(), {
  tabs: () => [],
  ariaLabel: 'Переключение разделов'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="base-tabs" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      class="base-tabs__button"
      :class="{ 'is-active': modelValue === tab.value }"
      type="button"
      role="tab"
      :disabled="tab.disabled"
      :aria-selected="modelValue === tab.value"
      @click="emit('update:modelValue', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
