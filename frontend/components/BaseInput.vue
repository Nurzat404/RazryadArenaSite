<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string | number
  id?: string
  label?: string
  type?: string
  placeholder?: string
  help?: string
  error?: string
  autocomplete?: string
  required?: boolean
  disabled?: boolean
}>(), {
  modelValue: '',
  type: 'text'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = computed(() => props.id || `input-${useId()}`)
</script>

<template>
  <div class="base-field" :class="{ 'has-error': error }">
    <label v-if="label" class="base-field__label" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      class="base-field__control"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      :disabled="disabled"
      :aria-invalid="Boolean(error)"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <p v-if="error" class="base-field__message base-field__message--error">{{ error }}</p>
    <p v-else-if="help" class="base-field__message">{{ help }}</p>
  </div>
</template>
