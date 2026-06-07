<script setup lang="ts">
const props = withDefaults(defineProps<{
  page: number
  totalPages: number
}>(), {
  page: 1,
  totalPages: 1
})

const emit = defineEmits<{
  'update:page': [value: number]
}>()

const pages = computed(() => Array.from({ length: props.totalPages }, (_, index) => index + 1))
const setPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.page) {
    emit('update:page', page)
  }
}
</script>

<template>
  <nav class="base-pagination" aria-label="Пагинация">
    <button type="button" :disabled="page <= 1" @click="setPage(page - 1)">Назад</button>
    <button
      v-for="item in pages"
      :key="item"
      type="button"
      :class="{ 'is-active': item === page }"
      :aria-current="item === page ? 'page' : undefined"
      @click="setPage(item)"
    >
      {{ item }}
    </button>
    <button type="button" :disabled="page >= totalPages" @click="setPage(page + 1)">Вперёд</button>
  </nav>
</template>
