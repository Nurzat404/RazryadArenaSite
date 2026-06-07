<script setup lang="ts">
interface BaseSelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  modelValue?: string | number
  id?: string
  label?: string
  placeholder?: string
  options: BaseSelectOption[]
  help?: string
  error?: string
  required?: boolean
  disabled?: boolean
}>(), {
  modelValue: '',
  options: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectId = computed(() => props.id || `select-${useId()}`)
</script>

<template>
  <div class="base-field" :class="{ 'has-error': error }">
    <label v-if="label" class="base-field__label" :for="selectId">{{ label }}</label>
    <select
      :id="selectId"
      class="base-field__control base-field__control--select"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      :aria-invalid="Boolean(error)"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value" :disabled="option.disabled">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="base-field__message base-field__message--error">{{ error }}</p>
    <p v-else-if="help" class="base-field__message">{{ help }}</p>
  </div>
</template>
