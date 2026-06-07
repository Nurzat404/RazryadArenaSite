<script setup lang="ts">
withDefaults(defineProps<{
  homeScore?: number
  awayScore?: number
  status?: string
}>(), {
  status: 'scheduled'
})
</script>

<template>
  <span class="match-score" :class="{ 'match-score--empty': homeScore === undefined || awayScore === undefined }">
    <strong>{{ homeScore ?? '-' }}</strong>
    <span>:</span>
    <strong>{{ awayScore ?? '-' }}</strong>
  </span>
</template>
