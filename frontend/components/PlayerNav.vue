<script setup lang="ts">
const props = defineProps<{
  playerId: string
  active: 'overview' | 'stats' | 'matches'
}>()

const links = [
  { key: 'overview' as const, label: 'Профиль', to: `/players/${props.playerId}` },
  { key: 'stats' as const, label: 'Показатели', to: `/players/${props.playerId}/stats` },
  { key: 'matches' as const, label: 'Матчи', to: `/players/${props.playerId}/matches` }
]
</script>

<template>
  <nav class="player-local-nav" aria-label="Разделы игрока">
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
