<script setup lang="ts">
import { teamService, userService } from '~/services'
import type { SportKey } from '~/types/domain'

const auth = useAuthStore()

useHead(() => ({
  title: 'Поиск команд',
  bodyAttrs: {
    class: auth.isAuthenticated ? 'layout-user' : 'layout-public',
    'data-page': 'teams-search',
    'data-role': auth.isAuthenticated ? 'user' : 'public'
  }
}))

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const [teams, users] = await Promise.all([
  teamService.list(),
  userService.list()
])

const userById = new Map(users.map((user) => [user.id, user]))
const query = ref('')
const city = ref('')
const sport = ref<'all' | SportKey>('all')
const openOnly = ref(false)

const cityOptions = [...new Set(teams.map((team) => team.city))]

const results = computed(() => teams.filter((team) => {
  const matchesQuery = query.value.trim()
    ? team.name.toLowerCase().includes(query.value.trim().toLowerCase())
    : true
  const matchesCity = city.value ? team.city === city.value : true
  const matchesSport = sport.value === 'all' ? true : team.sport === sport.value
  const matchesOpen = openOnly.value ? team.isOpenForRequests : true

  return matchesQuery && matchesCity && matchesSport && matchesOpen
}))
</script>

<template>
  <section class="section-padding workspace-page workspace-page--teams">
    <div class="container">
      <PageHead
        title="Поиск команд"
        subtitle="Найдите команду по спорту, городу и открытым заявкам."
      />

      <div class="teams-toolbar">
        <label class="teams-toolbar__search" for="teamQuery">
          <span>Название</span>
          <input id="teamQuery" v-model="query" class="form-control" type="search" placeholder="Arena, Ural, Dust...">
        </label>

        <label class="teams-toolbar__select" for="teamCity">
          <span>Город</span>
          <select id="teamCity" v-model="city" class="form-select">
            <option value="">Все города</option>
            <option v-for="item in cityOptions" :key="item" :value="item">{{ item }}</option>
          </select>
        </label>

        <label class="teams-toolbar__select" for="teamSport">
          <span>Спорт</span>
          <select id="teamSport" v-model="sport" class="form-select">
            <option value="all">Все виды</option>
            <option v-for="(label, key) in sportLabels" :key="key" :value="key">{{ label }}</option>
          </select>
        </label>

        <label class="teams-open-toggle">
          <input v-model="openOnly" type="checkbox">
          <span>Только открытые заявки</span>
        </label>
      </div>

      <div v-if="results.length" class="profile-grid">
        <article v-for="team in results" :key="team.id" class="profile-card">
          <div class="profile-card__head">
            <div>
              <span class="profile-card__badge">{{ sportLabels[team.sport] }}</span>
              <h2>{{ team.name }}</h2>
            </div>
            <span class="profile-card__rating">Рейтинг <strong>{{ team.rating }}</strong></span>
          </div>

          <dl class="profile-card__meta">
            <div>
              <dt>Капитан</dt>
              <dd>{{ userById.get(team.captainId)?.name ?? 'Не найден' }}</dd>
            </div>
            <div>
              <dt>Город</dt>
              <dd>{{ team.city }}</dd>
            </div>
            <div>
              <dt>Состав</dt>
              <dd>{{ team.memberIds.length }}/{{ team.maxMembers }}</dd>
            </div>
          </dl>

          <div class="profile-card__actions">
            <NuxtLink class="cta-button cta-button-primary" :to="`/teams/${team.id}`">Открыть команду</NuxtLink>
          </div>
        </article>
      </div>

      <div v-else class="empty-state-panel">
        <h2>Ничего не нашли</h2>
        <p>Попробуйте убрать город, сменить спорт или посмотреть все команды.</p>
        <div class="empty-state-panel__actions">
          <button class="cta-button cta-button-secondary" type="button" @click="query = ''; city = ''; sport = 'all'; openOnly = false">
            Сбросить поиск
          </button>
          <NuxtLink class="cta-button cta-button-primary" to="/teams/create">Создать команду</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
