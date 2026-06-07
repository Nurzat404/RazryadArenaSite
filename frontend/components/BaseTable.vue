<script setup lang="ts">
interface BaseTableColumn {
  key: string
  label: string
  align?: 'start' | 'center' | 'end'
}

withDefaults(defineProps<{
  columns: BaseTableColumn[]
  rows?: Record<string, unknown>[]
  emptyText?: string
}>(), {
  columns: () => [],
  rows: () => [],
  emptyText: 'Нет данных для отображения'
})
</script>

<template>
  <div class="base-table">
    <table>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" :class="`text-${column.align || 'start'}`">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody v-if="rows.length">
        <tr v-for="(row, rowIndex) in rows" :key="String(row.id ?? rowIndex)">
          <td v-for="column in columns" :key="column.key" :class="`text-${column.align || 'start'}`">
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!rows.length" class="base-table__empty">{{ emptyText }}</div>
  </div>
</template>
