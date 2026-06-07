<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <header class="page-head">
    <h1 class="section-title">
      {{ title }}
    </h1>
    <p v-if="subtitle" class="section-subtitle mx-auto mb-0">
      {{ subtitle }}
    </p>
  </header>
</template>
