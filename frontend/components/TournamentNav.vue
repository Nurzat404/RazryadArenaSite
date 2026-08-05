<script setup lang="ts">
const props = defineProps<{
  tournamentId: string
  active: 'overview' | 'teams' | 'bracket' | 'schedule' | 'rules'
}>()

const links = [
  { key: 'overview' as const, label: 'Обзор', to: `/tournaments/${props.tournamentId}` },
  { key: 'teams' as const, label: 'Команды', to: `/tournaments/${props.tournamentId}/teams` },
  { key: 'bracket' as const, label: 'Сетка', to: `/tournaments/${props.tournamentId}/bracket` },
  { key: 'schedule' as const, label: 'Расписание', to: `/tournaments/${props.tournamentId}/schedule` },
  { key: 'rules' as const, label: 'Правила', to: `/tournaments/${props.tournamentId}/rules` }
]
</script>

<template>
  <nav class="tournament-local-nav" aria-label="Разделы турнира">
    <NuxtLink
      v-for="link in links"
      :key="link.key"
      :class="{ 'is-active': link.key === active }"
      :to="link.to"
    >
      {{ link.label }}
    </NuxtLink>
  </nav>
</template>
