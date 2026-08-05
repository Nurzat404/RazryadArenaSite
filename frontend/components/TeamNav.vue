<script setup lang="ts">
const props = defineProps<{
  teamId: string
  active: 'overview' | 'members' | 'requests' | 'invite' | 'settings'
  canManage: boolean
}>()

const route = useRoute()

const links = [
  { key: 'overview' as const, label: 'Обзор', to: `/teams/${props.teamId}` },
  { key: 'members' as const, label: 'Состав', to: `/teams/${props.teamId}/members` }
]

const managementLinks = [
  { key: 'requests' as const, label: 'Заявки', to: `/teams/${props.teamId}/requests` },
  { key: 'invite' as const, label: 'Приглашения', to: `/teams/${props.teamId}/invite` },
  { key: 'settings' as const, label: 'Настройки', to: `/teams/${props.teamId}/edit` }
]

const withSource = (to: string) => route.query.from === 'profile-teams'
  ? { path: to, query: { from: 'profile-teams' } }
  : to
</script>

<template>
  <nav v-if="canManage" class="team-local-nav" aria-label="Разделы команды">
    <NuxtLink
      v-for="link in links"
      :key="link.key"
      :class="{ 'is-active': link.key === active }"
      :to="withSource(link.to)"
    >
      {{ link.label }}
    </NuxtLink>

    <template v-if="canManage">
      <NuxtLink
        v-for="link in managementLinks"
        :key="link.key"
        :class="{ 'is-active': link.key === active }"
        :to="withSource(link.to)"
      >
        {{ link.label }}
      </NuxtLink>
    </template>
  </nav>
</template>
