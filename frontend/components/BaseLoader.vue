<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  centered?: boolean
}>(), {
  label: 'Загрузка'
})
</script>

<template>
  <div class="base-loader-wrap" :class="{ 'base-loader-wrap--centered': centered }" role="status">
    <span class="base-loader" aria-hidden="true" />
    <span class="visually-hidden">{{ label }}</span>
    <span v-if="label" class="base-loader-wrap__label">{{ label }}</span>
  </div>
</template>
