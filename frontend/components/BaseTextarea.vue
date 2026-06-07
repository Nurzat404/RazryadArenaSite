<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string
  id?: string
  label?: string
  placeholder?: string
  rows?: number
  help?: string
  error?: string
  required?: boolean
  disabled?: boolean
}>(), {
  modelValue: '',
  rows: 4
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaId = computed(() => props.id || `textarea-${useId()}`)
</script>

<template>
  <div class="base-field" :class="{ 'has-error': error }">
    <label v-if="label" class="base-field__label" :for="textareaId">{{ label }}</label>
    <textarea
      :id="textareaId"
      class="base-field__control"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :required="required"
      :disabled="disabled"
      :aria-invalid="Boolean(error)"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <p v-if="error" class="base-field__message base-field__message--error">{{ error }}</p>
    <p v-else-if="help" class="base-field__message">{{ help }}</p>
  </div>
</template>
