<script setup lang="ts">
import type { SportKey, User } from '~/types/domain'

const props = defineProps<{ player: User }>()
const auth = useAuthStore()

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const initials = computed(() => props.player.name
  .split(/\s+/)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase())
</script>

<template>
  <header class="player-identity">
    <div class="player-identity__avatar" aria-hidden="true">{{ initials }}</div>
    <div class="player-identity__body">
      <span class="player-identity__eyebrow">Игрок РазрядАрены</span>
      <h1>{{ player.name }}</h1>
      <p>{{ player.city || 'Город не указан' }}<template v-if="player.age"> · {{ player.age }} лет</template></p>
      <div class="player-identity__sports">
        <span v-for="sport in player.favoriteSports" :key="sport">{{ sportLabels[sport] }}</span>
      </div>
    </div>
    <div class="player-identity__actions">
      <NuxtLink v-if="auth.user?.id === player.id" class="cta-button cta-button-secondary" to="/profile/edit">Редактировать профиль</NuxtLink>
      <a v-if="player.steamProfileUrl" class="player-steam-link" :href="player.steamProfileUrl" target="_blank" rel="noopener noreferrer">Профиль Steam</a>
    </div>
  </header>
</template>
