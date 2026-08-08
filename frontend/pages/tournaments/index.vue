<script setup lang="ts">
import { applicationService, tournamentService } from '~/services'
import type { SportKey, TournamentStatus } from '~/types/domain'

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const statusLabels: Record<TournamentStatus, string> = {
  draft: 'Готовится',
  registration_open: 'Идут заявки',
  registration_closed: 'Заявки закрыты',
  active: 'Идёт турнир',
  finished: 'Завершён'
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(value))

const tournaments = await tournamentService.list()
const auth = useAuthStore()
const selectedSport = ref<'all' | SportKey>('all')
const selectedStatus = ref<'all' | TournamentStatus>('all')
const selectedCity = ref('')
const openOnly = ref(false)
const search = ref('')
const cityOptions = [...new Set(tournaments.map((tournament) => tournament.city))]

const filteredTournaments = computed(() => tournaments.filter((tournament) => {
  const query = search.value.trim().toLowerCase()
  return (selectedSport.value === 'all' || tournament.sport === selectedSport.value)
    && (selectedStatus.value === 'all' || tournament.status === selectedStatus.value)
    && (!selectedCity.value || tournament.city === selectedCity.value)
    && (!openOnly.value || tournament.status === 'registration_open')
    && (!query || tournament.name.toLowerCase().includes(query))
}))
const applicationsByTournament = new Map(
  await Promise.all(tournaments.map(async (tournament) => [
    tournament.id,
    await applicationService.list({ tournamentId: tournament.id })
  ] as const))
)

useHead(() => ({
  title: 'Турниры',
  meta: [{ name: 'description', content: 'Любительские турниры РазрядАрены: открытые заявки, даты, формат и место проведения.' }],
  bodyAttrs: {
    class: auth.isAuthenticated ? 'layout-user' : 'layout-public',
    'data-page': 'tournaments',
    'data-role': auth.isAuthenticated ? 'user' : 'public'
  }
}))
</script>

<template>
  <div class="section-padding workspace-page workspace-page--tournaments">
    <div class="container">
      <div class="page-head">
        <h1 class="section-title">Турниры</h1>
        <p class="section-subtitle">
          Сроки регистрации, место проведения и требования к составу. Проверьте условия до подачи заявки.
        </p>
      </div>

      <section class="teams-toolbar tournament-toolbar" aria-label="Фильтры турниров">
        <label class="teams-toolbar__search" for="tournamentSearch">
          <span>Название</span>
          <input id="tournamentSearch" v-model="search" class="form-control" type="search" placeholder="Найти турнир">
        </label>
        <label class="teams-toolbar__select" for="tournamentCity">
          <span>Город</span>
          <select id="tournamentCity" v-model="selectedCity" class="form-select">
            <option value="">Все города</option>
            <option v-for="city in cityOptions" :key="city" :value="city">{{ city }}</option>
          </select>
        </label>
        <label class="teams-toolbar__select" for="tournamentSport">
          <span>Вид спорта</span>
          <select id="tournamentSport" v-model="selectedSport" class="form-select">
            <option value="all">Все виды</option>
            <option v-for="(label, sport) in sportLabels" :key="sport" :value="sport">{{ label }}</option>
          </select>
        </label>
        <label class="teams-toolbar__select" for="tournamentStatus">
          <span>Статус</span>
          <select id="tournamentStatus" v-model="selectedStatus" class="form-select">
            <option value="all">Любой статус</option>
            <option v-for="(label, status) in statusLabels" :key="status" :value="status">{{ label }}</option>
          </select>
        </label>
        <label class="teams-open-toggle">
          <input v-model="openOnly" type="checkbox">
          <span>Только открытые заявки</span>
        </label>
      </section>

      <div v-if="filteredTournaments.length" class="tournament-directory">
        <article v-for="tournament in filteredTournaments" :key="tournament.id" class="tournament-directory-row">
          <div class="tournament-directory-row__date">
            <span>Старт</span>
            <strong>{{ formatDate(tournament.eventStartDate) }}</strong>
          </div>

          <div class="tournament-directory-row__main">
            <div class="tournament-directory-row__labels">
              <span>{{ sportLabels[tournament.sport] }}</span>
              <StatusBadge :status="tournament.status" :label="statusLabels[tournament.status]" />
            </div>
            <h2>{{ tournament.name }}</h2>
            <p>{{ tournament.description }}</p>
          </div>

          <dl class="tournament-directory-row__facts">
            <div><dt>Город</dt><dd>{{ tournament.city }}</dd></div>
            <div><dt>Состав</dt><dd>{{ tournament.requiredTeamSize }} игроков</dd></div>
            <div><dt>Заявки</dt><dd>{{ applicationsByTournament.get(tournament.id)?.length ?? 0 }}/{{ tournament.maxTeams }}</dd></div>
          </dl>

          <NuxtLink class="tournament-directory-row__link" :to="`/tournaments/${tournament.id}`">Открыть</NuxtLink>
        </article>
      </div>

      <div v-else class="empty-state-panel">
        <h2>Турниры не найдены</h2>
        <p>Попробуйте убрать город, статус или выбранный вид спорта.</p>
        <button class="cta-button cta-button-primary" type="button" @click="selectedSport = 'all'; selectedStatus = 'all'; selectedCity = ''; openOnly = false; search = ''">Сбросить фильтры</button>
      </div>
    </div>
  </div>
</template>
