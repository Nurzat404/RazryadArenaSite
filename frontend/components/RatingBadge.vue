<script setup lang="ts">
const props = withDefaults(defineProps<{
  points: number
  delta?: number
  label?: string
}>(), {
  label: 'Рейтинг'
})

const deltaText = computed(() => {
  if (props.delta === undefined || props.delta === 0) return ''
  return props.delta > 0 ? `+${props.delta}` : String(props.delta)
})
</script>

<template>
  <span class="rating-badge">
    <span>{{ label }}</span>
    <strong>{{ points }}</strong>
    <em v-if="deltaText" :class="{ 'is-positive': (delta || 0) > 0, 'is-negative': (delta || 0) < 0 }">{{ deltaText }}</em>
  </span>
</template>
