<script setup lang="ts">
import { matchService, teamService, tournamentService } from '~/services'
import type { MatchStatus, SportKey } from '~/types/domain'

definePageMeta({ layout: 'app', middleware: 'auth' })

useHead({
  title: 'Мои матчи | РазрядАрена',
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
  <section>
    <PageHead
      title="Мои матчи"
      subtitle="Матчи ваших команд: где играем, против кого и какой результат уже внесён."
    />

    <div v-if="uniqueMatches.length" class="profile-grid">
      <article v-for="match in uniqueMatches" :key="match.id" class="profile-card">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">{{ sportLabels[match.sport] }}</span>
            <h2>{{ ownTeamName(match.team1Id, match.team2Id) }} против {{ opponentName(ownTeamId(match.team1Id, match.team2Id), match.team1Id, match.team2Id) }}</h2>
          </div>
          <StatusBadge :status="match.status" :label="matchStatusLabels[match.status]" />
        </div>

        <dl class="profile-card__meta">
          <div>
            <dt>Когда</dt>
            <dd>{{ formatDateTime(match.scheduledAt) }}</dd>
          </div>
          <div>
            <dt>Место</dt>
            <dd>{{ match.location }}</dd>
          </div>
          <div>
            <dt>Счёт</dt>
            <dd>{{ match.score1 !== undefined ? `${match.score1}:${match.score2}` : 'Ждём игру' }}</dd>
          </div>
        </dl>

        <p class="profile-card__note">
          Турнир: {{ tournamentById.get(match.tournamentId)?.name ?? 'турнир не найден' }}.
        </p>

        <div class="profile-card__actions">
          <NuxtLink class="cta-button cta-button-primary" to="/matches">Открыть матчи</NuxtLink>
          <NuxtLink class="cta-button cta-button-secondary" :to="`/tournaments/${match.tournamentId}`">Открыть турнир</NuxtLink>
        </div>
      </article>
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
