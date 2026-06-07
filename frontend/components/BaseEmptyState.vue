<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  text?: string
  icon?: string
}>(), {
  icon: '•'
})
</script>

<template>
  <section class="base-empty-state">
    <span class="base-empty-state__icon" aria-hidden="true">{{ icon }}</span>
    <h2>{{ title }}</h2>
    <p v-if="text">{{ text }}</p>
    <div v-if="$slots.actions" class="base-empty-state__actions">
      <slot name="actions" />
    </div>
  </section>
</template>
