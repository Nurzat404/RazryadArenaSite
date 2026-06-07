<script setup lang="ts">
import type { UiStatus } from '~/types/domain'

const props = withDefaults(defineProps<{
  status: UiStatus | string
  label?: string
}>(), {
  label: ''
})

const statusMap: Record<string, { label: string, tone: string }> = {
  draft: { label: 'Черновик', tone: 'neutral' },
  registration_open: { label: 'Регистрация открыта', tone: 'success' },
  registration_closed: { label: 'Регистрация закрыта', tone: 'warning' },
  active: { label: 'Идёт', tone: 'success' },
  finished: { label: 'Завершён', tone: 'info' },
  pending: { label: 'Ожидает', tone: 'warning' },
  approved: { label: 'Одобрена', tone: 'success' },
  rejected: { label: 'Отклонена', tone: 'danger' },
  excluded: { label: 'Исключена', tone: 'danger' },
  team_excluded: { label: 'Команда исключена', tone: 'danger' },
  scheduled: { label: 'Матч назначен', tone: 'warning' },
  technical_win: { label: 'Техническая победа', tone: 'info' }
}

const meta = computed(() => statusMap[props.status] ?? { label: props.label || props.status, tone: 'neutral' })
const text = computed(() => props.label || meta.value.label)
</script>

<template>
  <span class="status-badge-v2" :class="`status-badge-v2--${meta.tone}`">
    {{ text }}
  </span>
</template>
