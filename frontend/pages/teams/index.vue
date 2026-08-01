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
const auth = useAuthStore()
const selectedSport = ref<'all' | SportKey>('all')
const selectedCity = ref('')
const openOnly = ref(false)
const search = ref('')
const cityOptions = [...new Set(allTeams.map((team) => team.city))]
const getTeamInitials = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

const filteredTeams = computed(() => allTeams.filter((team) => {
  const matchesSport = selectedSport.value === 'all' ? true : team.sport === selectedSport.value
  const matchesOpen = openOnly.value ? team.isOpenForRequests : true
  const matchesCity = selectedCity.value ? team.city === selectedCity.value : true
  const matchesSearch = search.value.trim()
    ? team.name.toLowerCase().includes(search.value.trim().toLowerCase())
    : true

  return matchesSport && matchesOpen && matchesCity && matchesSearch
}))

useHead(() => ({
  title: 'Команды',
  bodyAttrs: {
    class: auth.isAuthenticated ? 'layout-user' : 'layout-public',
    'data-page': 'teams',
    'data-role': auth.isAuthenticated ? 'user' : 'public'
  }
}))
</script>

<template>
  <div class="section-padding workspace-page workspace-page--teams">
    <div class="container">
      <div class="page-head">
        <h1 class="section-title">Команды</h1>
        <p class="section-subtitle">
          Найдите команду по спорту и городу, посмотрите состав или соберите свою.
        </p>
      </div>

      <div class="teams-toolbar team-toolbar">
        <label class="teams-toolbar__search" for="teamSearch">
          <span>Поиск</span>
          <input id="teamSearch" v-model="search" class="form-control" type="search" placeholder="Название команды">
        </label>

        <label class="teams-toolbar__select" for="teamSport">
          <span>Вид спорта</span>
          <select id="teamSport" v-model="selectedSport" class="form-select">
            <option value="all">Все виды</option>
            <option v-for="(label, sport) in sportLabels" :key="sport" :value="sport">{{ label }}</option>
          </select>
        </label>

        <label class="teams-toolbar__select" for="teamCity">
          <span>Город</span>
          <select id="teamCity" v-model="selectedCity" class="form-select">
            <option value="">Все города</option>
            <option v-for="city in cityOptions" :key="city" :value="city">{{ city }}</option>
          </select>
        </label>

        <div class="teams-toolbar__actions">
          <NuxtLink class="cta-button cta-button-primary" to="/teams/create">Создать команду</NuxtLink>
        </div>

        <label class="teams-open-toggle">
          <input v-model="openOnly" type="checkbox">
          <span>Только с открытыми заявками</span>
        </label>
      </div>

      <div v-if="filteredTeams.length" class="team-directory">
        <article v-for="team in filteredTeams" :key="team.id" class="team-directory-row" :data-sport="team.sport">
          <div class="team-directory-row__mark" aria-hidden="true">{{ getTeamInitials(team.name) }}</div>

          <div class="team-directory-row__main">
            <span>{{ sportLabels[team.sport] }}</span>
            <h2>{{ team.name }}</h2>
            <p>{{ team.city }} · капитан {{ userById.get(team.captainId)?.name ?? 'не найден' }}</p>
          </div>

          <div class="team-directory-row__roster">
            <div><span>Состав</span><strong>{{ team.memberIds.length }}/{{ team.maxMembers }}</strong></div>
            <div class="team-directory-row__progress" aria-hidden="true">
              <span :style="{ width: `${Math.min((team.memberIds.length / team.maxMembers) * 100, 100)}%` }"></span>
            </div>
            <small>{{ team.isOpenForRequests ? 'Принимают заявки' : 'Состав закрыт' }}</small>
          </div>

          <div class="team-directory-row__rating"><span>Рейтинг</span><strong>{{ team.rating }}</strong></div>
          <NuxtLink class="team-directory-row__link" :to="`/teams/${team.id}`">Открыть</NuxtLink>
        </article>
      </div>

      <div v-else class="empty-state-panel">
        <h2>Команд по таким условиям нет</h2>
        <p>Сбросьте фильтры или создайте свою команду.</p>
        <div class="empty-state-panel__actions">
          <button class="cta-button cta-button-secondary" type="button" @click="selectedSport = 'all'; selectedCity = ''; openOnly = false; search = ''">
            Сбросить фильтры
          </button>
          <NuxtLink class="cta-button cta-button-primary" to="/teams/create">Создать команду</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
