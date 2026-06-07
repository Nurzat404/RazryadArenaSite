<script setup lang="ts">
import type { SportKey } from '~/types/domain'

const props = withDefaults(defineProps<{
  sport: SportKey | string
  size?: 'sm' | 'md'
}>(), {
  size: 'md'
})

const labels: Record<string, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const label = computed(() => labels[props.sport] ?? props.sport)
</script>

<template>
  <span class="sport-badge" :class="[`sport-badge--${sport}`, `sport-badge--${size}`]">
    {{ label }}
  </span>
</template>
