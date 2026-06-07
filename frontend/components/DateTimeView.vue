<script setup lang="ts">
import dayjs from 'dayjs'

const props = withDefaults(defineProps<{
  value: string | Date
  format?: string
  emptyText?: string
}>(), {
  format: 'DD.MM.YYYY HH:mm',
  emptyText: 'Дата не указана'
})

const formatted = computed(() => {
  const date = dayjs(props.value)
  return date.isValid() ? date.format(props.format) : props.emptyText
})
</script>

<template>
  <time class="date-time-view" :datetime="String(value)">
    {{ formatted }}
  </time>
</template>
