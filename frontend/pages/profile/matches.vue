<script setup lang="ts">
import { matchService, teamService, tournamentService } from '~/services'
import type { MatchStatus, SportKey } from '~/types/domain'

definePageMeta({ layout: 'app', middleware: 'auth' })

useHead({
  title: 'Мои матчи',
  meta: [
    {
      name: 'description',
      content: 'История и ближайшие матчи игрока РазрядАрены по его командам.'
    }
  ]
})

const auth = useAuthStore()

if (!auth.initialized) {
  await auth.loadCurrentUser()
}

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const matchStatusLabels: Record<MatchStatus, string> = {
  scheduled: 'Назначен',
  active: 'Идёт сейчас',
  finished: 'Завершён',
  technical_win: 'Технический результат'
}

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))

const userTeams = auth.user ? await teamService.listByUser(auth.user.id) : []
const allTeams = await teamService.list()
const allTournaments = await tournamentService.list()
const teamById = new Map(allTeams.map((team) => [team.id, team]))
const tournamentById = new Map(allTournaments.map((tournament) => [tournament.id, tournament]))
const teamIds = userTeams.map((team) => team.id)

const matches = (
  await Promise.all(teamIds.map((teamId) => matchService.list({ teamId })))
).flat()

const uniqueMatches = [...new Map(matches.map((match) => [match.id, match])).values()]
  .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
const upcomingMatches = uniqueMatches.filter((match) => ['scheduled', 'active'].includes(match.status))
const completedMatches = uniqueMatches.filter((match) => ['finished', 'technical_win'].includes(match.status))

const opponentName = (teamId: string, team1Id: string, team2Id: string) => {
  const opponentId = teamId === team1Id ? team2Id : team1Id
  return teamById.get(opponentId)?.name ?? 'Соперник уточняется'
}

const ownTeamName = (team1Id: string, team2Id: string) => {
  const ownTeam = userTeams.find((team) => [team1Id, team2Id].includes(team.id))
  return ownTeam?.name ?? 'Ваша команда'
}

const ownTeamId = (team1Id: string, team2Id: string) =>
  userTeams.find((team) => [team1Id, team2Id].includes(team.id))?.id ?? team1Id
</script>

<template>
  <section class="workspace-page workspace-page--profile">
    <PageHead
      title="Мои матчи"
      subtitle="Ближайшие игры и результаты ваших команд."
    />

    <div v-if="uniqueMatches.length" class="personal-matches">
      <section v-if="upcomingMatches.length" class="personal-matches__section">
        <h2>Ближайшие</h2>
        <article v-for="match in upcomingMatches" :key="match.id" class="personal-match-row">
          <time>{{ formatDateTime(match.scheduledAt) }}</time>
          <div>
            <span>{{ sportLabels[match.sport] }} · {{ tournamentById.get(match.tournamentId)?.name ?? 'Турнир' }}</span>
            <strong>{{ ownTeamName(match.team1Id, match.team2Id) }} — {{ opponentName(ownTeamId(match.team1Id, match.team2Id), match.team1Id, match.team2Id) }}</strong>
            <small>{{ match.location }}</small>
          </div>
          <StatusBadge :status="match.status" :label="matchStatusLabels[match.status]" />
          <NuxtLink :to="`/matches/${match.id}`">Открыть матч</NuxtLink>
        </article>
      </section>

      <section v-if="completedMatches.length" class="personal-matches__section">
        <h2>Сыгранные</h2>
        <article v-for="match in completedMatches" :key="match.id" class="personal-match-row">
          <time>{{ formatDateTime(match.scheduledAt) }}</time>
          <div>
            <span>{{ sportLabels[match.sport] }} · {{ tournamentById.get(match.tournamentId)?.name ?? 'Турнир' }}</span>
            <strong>{{ ownTeamName(match.team1Id, match.team2Id) }} — {{ opponentName(ownTeamId(match.team1Id, match.team2Id), match.team1Id, match.team2Id) }}</strong>
            <small>Счёт {{ match.score1 }}:{{ match.score2 }}</small>
          </div>
          <StatusBadge :status="match.status" :label="matchStatusLabels[match.status]" />
          <NuxtLink :to="`/matches/${match.id}`">Открыть матч</NuxtLink>
        </article>
      </section>
    </div>

    <div v-else class="empty-state-panel">
      <h2>Матчей пока нет</h2>
      <p>Когда команда попадёт в турнирную сетку или расписание, матчи появятся здесь.</p>
      <div class="empty-state-panel__actions">
        <NuxtLink class="cta-button cta-button-primary" to="/tournaments">Смотреть турниры</NuxtLink>
        <NuxtLink class="cta-button cta-button-secondary" to="/profile/teams">Мои команды</NuxtLink>
      </div>
    </div>
  </section>
</template>
