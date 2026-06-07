<script setup lang="ts">
withDefaults(defineProps<{
  tone?: 'neutral' | 'warning' | 'success' | 'danger' | 'info' | 'accent'
  size?: 'sm' | 'md'
}>(), {
  tone: 'neutral',
  size: 'md'
})
</script>

<template>
  <span class="base-badge" :class="[`base-badge--${tone}`, `base-badge--${size}`]">
    <slot />
  </span>
</template>
