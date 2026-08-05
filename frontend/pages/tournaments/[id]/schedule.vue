<script setup lang="ts">
import { matchService, teamService, tournamentService } from '~/services'
import type { Match, MatchStatus, SportKey } from '~/types/domain'

const route = useRoute()
const tournamentId = String(route.params.id)
const [tournament, matches, teams] = await Promise.all([
  tournamentService.getById(tournamentId),
  matchService.list({ tournamentId }),
  teamService.list()
])

const teamById = new Map(teams.map((team) => [team.id, team]))
const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2', football: 'Футбол', basketball: 'Баскетбол', volleyball: 'Волейбол'
}
const statusLabels: Record<MatchStatus, string> = {
  scheduled: 'Матч назначен', active: 'Идёт сейчас', finished: 'Матч завершён', technical_win: 'Технический результат'
}
const activeMatch = computed(() => matches.find((match) => match.status === 'active') ?? null)
const queuedMatches = computed(() => matches.filter((match) => match.status === 'scheduled'))
const fixedSchedule = computed(() => matches
  .filter((match) => match.status !== 'active')
  .reduce<Array<{ date: string, matches: Match[] }>>((groups, match) => {
    const date = new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(match.scheduledAt))
    const group = groups.find((item) => item.date === date)
    if (group) group.matches.push(match)
    else groups.push({ date, matches: [match] })
    return groups
  }, []))

const teamName = (teamId: string) => teamById.get(teamId)?.name ?? 'Команда уточняется'
const score = (match: Match) => match.score1 === undefined ? null : `${match.score1}:${match.score2}`
const formatTime = (value: string) => new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))

useHead({ title: tournament ? `Расписание — ${tournament.name}` : 'Расписание турнира' })
</script>

<template>
  <section class="section-padding workspace-page workspace-page--tournament-detail">
    <div class="container">
      <PageHead :title="tournament?.name ?? 'Турнир не найден'" :subtitle="tournament ? (tournament.scheduleMode === 'sequential' ? 'Текущий матч и порядок следующих игр.' : 'Дата, время и пары назначенных матчей.') : 'Проверьте адрес страницы или вернитесь к списку турниров.'" />

      <template v-if="tournament">
        <TournamentNav :tournament-id="tournament.id" active="schedule" />

        <section v-if="tournament.scheduleMode === 'sequential'" class="schedule-queue">
          <div class="schedule-queue__head">
            <div><p>Живая очередь</p><h2>Матчи идут по готовности команд</h2></div>
            <span>{{ sportLabels[tournament.sport] }}</span>
          </div>
          <NuxtLink v-if="activeMatch" class="schedule-live-match" :to="`/matches/${activeMatch.id}`">
            <span>Сейчас на площадке</span>
            <strong>{{ teamName(activeMatch.team1Id) }} <b>—</b> {{ teamName(activeMatch.team2Id) }}</strong>
            <small>{{ activeMatch.location }} · {{ score(activeMatch) ?? 'Счёт пока не внесён' }}</small>
          </NuxtLink>
          <p v-else class="schedule-queue__empty">Сейчас свободно. Следующую пару организатор добавит, когда команды будут готовы.</p>
          <div class="schedule-queue__next">
            <h3>Дальше</h3>
            <template v-if="queuedMatches.length">
              <NuxtLink v-for="match in queuedMatches" :key="match.id" :to="`/matches/${match.id}`">{{ teamName(match.team1Id) }} — {{ teamName(match.team2Id) }}</NuxtLink>
            </template>
            <p v-else>Следующая пара ещё не определена.</p>
          </div>
        </section>

        <section v-if="tournament.scheduleMode === 'fixed' && fixedSchedule.length" class="schedule-list" aria-label="Расписание турнира">
          <div v-for="group in fixedSchedule" :key="group.date" class="schedule-list__day">
            <h2>{{ group.date }}</h2>
            <article v-for="match in group.matches" :key="match.id" class="schedule-row">
              <time>{{ formatTime(match.scheduledAt) }}</time>
              <div class="schedule-row__pair">
                <NuxtLink :to="`/teams/${match.team1Id}`">{{ teamName(match.team1Id) }}</NuxtLink>
                <span>{{ score(match) ?? '—' }}</span>
                <NuxtLink :to="`/teams/${match.team2Id}`">{{ teamName(match.team2Id) }}</NuxtLink>
              </div>
              <span class="schedule-row__location">{{ match.location }}</span>
              <StatusBadge :status="match.status" :label="statusLabels[match.status]" />
              <NuxtLink class="schedule-row__link" :to="`/matches/${match.id}`">Матч</NuxtLink>
            </article>
          </div>
        </section>

        <div v-else-if="tournament.scheduleMode === 'fixed'" class="empty-state-panel">
          <h2>Расписание ещё не опубликовано</h2>
          <p>Организатор добавит пары и время матчей после жеребьёвки.</p>
        </div>
      </template>

      <div v-else class="empty-state-panel">
        <h2>Турнир не найден</h2>
        <NuxtLink class="cta-button cta-button-primary" to="/tournaments">Смотреть турниры</NuxtLink>
      </div>
    </div>
  </section>
</template>
