<script setup lang="ts">
import { teamService, userService } from '~/services'
import type { SportKey } from '~/types/domain'

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const [allTeams, users] = await Promise.all([
  teamService.list(),
  userService.list()
])

const userById = new Map(users.map((user) => [user.id, user]))
const selectedSport = ref<'all' | SportKey>('all')
const openOnly = ref(false)
const search = ref('')

const filteredTeams = computed(() => allTeams.filter((team) => {
  const matchesSport = selectedSport.value === 'all' ? true : team.sport === selectedSport.value
  const matchesOpen = openOnly.value ? team.isOpenForRequests : true
  const matchesSearch = search.value.trim()
    ? team.name.toLowerCase().includes(search.value.trim().toLowerCase())
    : true

  return matchesSport && matchesOpen && matchesSearch
}))

useHead({
  title: 'Команды — РазрядАрена',
  bodyAttrs: {
    class: 'layout-public',
    'data-page': 'teams',
    'data-role': 'public'
  }
})
</script>

<template>
  <div class="section-padding">
    <div class="container">
      <div class="page-head">
        <h1 class="section-title">Команды</h1>
        <p class="section-subtitle">
          Найдите команду, посмотрите состав или создайте свою. Капитанство не меняет роль аккаунта.
        </p>
      </div>

      <div class="teams-toolbar">
        <label class="teams-toolbar__search" for="teamSearch">
          <span>Поиск</span>
          <input id="teamSearch" v-model="search" class="form-control" type="search" placeholder="Название команды">
        </label>

        <div class="teams-toolbar__filters">
          <button
            class="teams-filter-button"
            :class="{ 'teams-filter-button--active': selectedSport === 'all' }"
            type="button"
            @click="selectedSport = 'all'"
          >
            Все
          </button>
          <button
            v-for="(label, sport) in sportLabels"
            :key="sport"
            class="teams-filter-button"
            :class="{ 'teams-filter-button--active': selectedSport === sport }"
            type="button"
            @click="selectedSport = sport"
          >
            {{ label }}
          </button>
        </div>

        <label class="teams-open-toggle">
          <input v-model="openOnly" type="checkbox">
          <span>Только с открытыми заявками</span>
        </label>

        <div class="teams-toolbar__actions">
          <NuxtLink class="cta-button cta-button-primary" to="/teams/create">Создать команду</NuxtLink>
          <NuxtLink class="cta-button cta-button-secondary" to="/teams/search">Расширенный поиск</NuxtLink>
        </div>
      </div>

      <div v-if="filteredTeams.length" class="profile-grid">
        <article v-for="team in filteredTeams" :key="team.id" class="profile-card">
          <div class="profile-card__head">
            <div>
              <span class="profile-card__badge">{{ sportLabels[team.sport] }}</span>
              <h2>{{ team.name }}</h2>
            </div>
            <strong>{{ team.rating }}</strong>
          </div>

          <dl class="profile-card__meta">
            <div>
              <dt>Капитан</dt>
              <dd>{{ userById.get(team.captainId)?.name ?? 'Не найден' }}</dd>
            </div>
            <div>
              <dt>Состав</dt>
              <dd>{{ team.memberIds.length }}/{{ team.maxMembers }}</dd>
            </div>
            <div>
              <dt>Город</dt>
              <dd>{{ team.city }}</dd>
            </div>
            <div>
              <dt>Заявки</dt>
              <dd>{{ team.isOpenForRequests ? 'Открыты' : 'Закрыты' }}</dd>
            </div>
          </dl>

          <div class="profile-card__actions">
            <NuxtLink class="cta-button cta-button-primary" :to="`/teams/${team.id}`">Открыть команду</NuxtLink>
            <NuxtLink class="cta-button cta-button-secondary" to="/tournaments">Смотреть турниры</NuxtLink>
          </div>
        </article>
      </div>

      <div v-else class="empty-state-panel">
        <h2>Команд по таким условиям нет</h2>
        <p>Сбросьте фильтры или создайте команду сами. Так часто быстрее, чем ждать идеальный состав в чате.</p>
        <div class="empty-state-panel__actions">
          <button class="cta-button cta-button-secondary" type="button" @click="selectedSport = 'all'; openOnly = false; search = ''">
            Сбросить фильтры
          </button>
          <NuxtLink class="cta-button cta-button-primary" to="/teams/create">Создать команду</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
