<script setup lang="ts">
import { matchService, teamService, tournamentService } from '~/services'
import type { Match, MatchStatus } from '~/types/domain'

type MatchFilter = 'all' | 'today' | 'upcoming' | 'finished'

const [matches, teams, tournaments] = await Promise.all([
  matchService.list(),
  teamService.list(),
  tournamentService.list()
])
const auth = useAuthStore()

const selectedFilter = ref<MatchFilter>('all')
const teamById = new Map(teams.map((team) => [team.id, team]))
const tournamentById = new Map(tournaments.map((tournament) => [tournament.id, tournament]))
const statusLabels: Record<MatchStatus, string> = {
  scheduled: 'Назначен',
  active: 'Идёт сейчас',
  finished: 'Завершён',
  technical_win: 'Технический результат'
}

const isToday = (value: string) => {
  const date = new Date(value)
  const today = new Date()
  return date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate()
}

const filteredMatches = computed(() => matches.filter((match) => {
  if (selectedFilter.value === 'today') return isToday(match.scheduledAt)
  if (selectedFilter.value === 'upcoming') return ['scheduled', 'active'].includes(match.status)
  if (selectedFilter.value === 'finished') return ['finished', 'technical_win'].includes(match.status)
  return true
}))

const formatDateTime = (value: string) => new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
}).format(new Date(value))

const matchPair = (match: Match) => `${teamById.get(match.team1Id)?.name ?? 'Команда уточняется'} — ${teamById.get(match.team2Id)?.name ?? 'Команда уточняется'}`
const matchScore = (match: Match) => match.score1 === undefined ? '' : `${match.score1}:${match.score2}`

useHead(() => ({
  title: 'Матчи',
  meta: [{ name: 'description', content: 'Расписание, соперники, место и результаты матчей РазрядАрены.' }],
  bodyAttrs: {
    class: auth.isAuthenticated ? 'layout-user' : 'layout-public',
    'data-page': 'matches',
    'data-role': auth.isAuthenticated ? 'user' : 'public'
  }
}))
</script>

<template>
  <div class="section-padding workspace-page workspace-page--matches">
    <div class="container">
      <div class="page-head">
        <h1 class="section-title">Матчи</h1>
        <p class="section-subtitle">Соперники, время, место и счёт предстоящих и завершённых игр.</p>
      </div>

      <section class="filter-panel mb-3" aria-label="Фильтр матчей">
        <div class="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
          <button v-for="item in [{ value: 'all', label: 'Все матчи' }, { value: 'today', label: 'Сегодня' }, { value: 'upcoming', label: 'Предстоящие' }, { value: 'finished', label: 'Завершённые' }]" :key="item.value" class="filter-chip" :class="{ 'is-active': selectedFilter === item.value }" type="button" @click="selectedFilter = item.value as MatchFilter">
            {{ item.label }}
          </button>
        </div>
      </section>

      <section v-if="filteredMatches.length" class="table-block mb-3">
        <div class="table-responsive">
          <table class="table table-dark-custom">
            <thead><tr><th>Турнир</th><th>Пара</th><th>Дата</th><th>Место</th><th>Статус</th></tr></thead>
            <tbody>
              <tr v-for="match in filteredMatches" :key="match.id">
                <td>{{ tournamentById.get(match.tournamentId)?.name ?? 'Турнир не найден' }}</td>
                <td><strong>{{ matchPair(match) }}</strong><span v-if="matchScore(match)" class="d-block text-muted-strong">Счёт {{ matchScore(match) }}</span></td>
                <td>{{ formatDateTime(match.scheduledAt) }}</td>
                <td>{{ match.location }}</td>
                <td><StatusBadge :status="match.status" :label="statusLabels[match.status]" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div v-else class="empty-state-panel">
        <h2>Таких матчей пока нет</h2>
        <p>Выберите другой период или откройте полный список.</p>
        <button class="cta-button cta-button-primary" type="button" @click="selectedFilter = 'all'">Показать все матчи</button>
      </div>
    </div>
  </div>
</template>
