<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md'
})

const initials = computed(() => props.name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase())
</script>

<template>
  <span class="entity-avatar entity-avatar--team" :class="[`entity-avatar--${size}`, { 'entity-avatar--image': src }]">
    <img v-if="src" :src="src" :alt="name">
    <span v-else>{{ initials }}</span>
  </span>
</template>
