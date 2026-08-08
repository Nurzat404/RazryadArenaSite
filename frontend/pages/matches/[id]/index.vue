<script setup lang="ts">
import { bracketService, matchResultService, matchService, teamService, tournamentService, userService } from '~/services'
import type { MatchStatus, PlayerMatchStat } from '~/types/domain'

const route = useRoute()
const auth = useAuthStore()
const match = await matchService.getById(String(route.params.id))
const [teams, tournament, bracketMatch, resultDetails, revisions, users] = await Promise.all([
  teamService.list(),
  match ? tournamentService.getById(match.tournamentId) : null,
  match ? bracketService.listByTournament(match.tournamentId).then((items) => items.find((item) => item.matchId === match.id) ?? null) : null,
  match ? matchResultService.getByMatchId(match.id) : null,
  match ? matchResultService.listRevisions(match.id) : [],
  userService.list()
])

const teamById = new Map(teams.map((team) => [team.id, team]))
const userById = new Map(users.map((user) => [user.id, user]))
const router = useRouter()
const resultSaved = ref(route.query.result === 'saved')

onMounted(() => {
  if (!resultSaved.value) return
  const query = { ...route.query }
  delete query.result
  void router.replace({ path: route.path, query })
})
const statusLabels: Record<MatchStatus, string> = {
  scheduled: 'Матч назначен',
  active: 'Идёт сейчас',
  finished: 'Матч завершён',
  technical_win: 'Технический результат'
}

const formatDateTime = (value: string) => new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit'
}).format(new Date(value))

const score = computed(() => match?.score1 === undefined ? '— : —' : `${match.score1} : ${match.score2}`)
const isFinished = computed(() => Boolean(match && ['finished', 'technical_win'].includes(match.status)))

const statSummary = (stat: PlayerMatchStat) => {
  if (!match) return ''
  if (match.sport === 'cs2') return `K ${stat.kills ?? 0} · D ${stat.deaths ?? 0} · A ${stat.assists ?? 0} · ADR ${stat.adr ?? 0}`
  if (match.sport === 'football') return `Голы ${stat.goals ?? 0} · передачи ${stat.assists ?? 0}`
  if (match.sport === 'basketball') return `Очки ${stat.points ?? 0} · фолы ${stat.fouls ?? 0}`
  return `Очки ${stat.points ?? 0} · эйсы ${stat.aces ?? 0}`
}

useHead({
  title: match && tournament ? `${teamById.get(match.team1Id)?.name ?? 'Матч'} — ${teamById.get(match.team2Id)?.name ?? ''}` : 'Матч',
  meta: match && tournament ? [{ name: 'description', content: `${tournament.name}: команды, время, место и результат матча.` }] : []
})
</script>

<template>
  <section class="section-padding workspace-page workspace-page--match-detail">
    <div class="container">
      <template v-if="match && tournament">
        <PageHead :title="tournament.name" :subtitle="statusLabels[match.status]" />

        <p v-if="resultSaved" class="form-success" role="status">Результат сохранён. Карточка матча и сетка обновлены.</p>

        <article class="match-detail-scoreboard">
          <NuxtLink
            class="match-detail-scoreboard__team"
            :class="{ 'is-winner': match.winnerId === match.team1Id }"
            :to="`/teams/${match.team1Id}`"
          >
            <span>{{ teamById.get(match.team1Id)?.sport === 'cs2' ? 'CS2' : 'Команда' }}</span>
            <h1>{{ teamById.get(match.team1Id)?.name ?? 'Команда уточняется' }}</h1>
          </NuxtLink>
          <div class="match-detail-scoreboard__score">
            <StatusBadge :status="match.status" :label="statusLabels[match.status]" />
            <strong>{{ score }}</strong>
            <small>{{ formatDateTime(match.scheduledAt) }}</small>
          </div>
          <NuxtLink
            class="match-detail-scoreboard__team"
            :class="{ 'is-winner': match.winnerId === match.team2Id }"
            :to="`/teams/${match.team2Id}`"
          >
            <span>{{ teamById.get(match.team2Id)?.sport === 'cs2' ? 'CS2' : 'Команда' }}</span>
            <h1>{{ teamById.get(match.team2Id)?.name ?? 'Команда уточняется' }}</h1>
          </NuxtLink>
        </article>

        <section class="match-detail-facts" aria-label="Детали матча">
          <div><span>Турнир</span><strong>{{ tournament.name }}</strong></div>
          <div><span>Место</span><strong>{{ match.location }}</strong></div>
          <div><span>Стадия</span><strong>{{ bracketMatch?.roundName ?? 'Матч турнира' }}</strong></div>
        </section>

        <section v-if="isFinished && resultDetails" class="match-protocol" aria-labelledby="matchProtocolTitle">
          <div class="match-protocol__head">
            <div>
              <span>Протокол матча</span>
              <h2 id="matchProtocolTitle">Результаты игры</h2>
            </div>
            <strong>{{ score }}</strong>
          </div>

          <p v-if="resultDetails.technicalReason" class="match-protocol__technical">
            Технический результат: {{ resultDetails.technicalReason }}
          </p>

          <div v-if="resultDetails.mapResults.length" class="match-protocol__series">
            <div v-for="map in resultDetails.mapResults" :key="map.mapName">
              <span>{{ map.mapName }}</span><strong>{{ map.score1 }} : {{ map.score2 }}</strong>
            </div>
          </div>

          <div v-if="resultDetails.volleyballSets.length" class="match-protocol__series">
            <div v-for="set in resultDetails.volleyballSets" :key="set.setNo">
              <span>Сет {{ set.setNo }}</span><strong>{{ set.score1 }} : {{ set.score2 }}</strong>
            </div>
          </div>

          <div v-if="resultDetails.playerStats.length" class="match-protocol__players">
            <div v-for="stat in resultDetails.playerStats" :key="stat.userId">
              <strong>{{ userById.get(stat.userId)?.name ?? 'Игрок' }}</strong>
              <span>{{ statSummary(stat) }}</span>
            </div>
          </div>

          <p v-if="resultDetails.mvpUserId" class="match-protocol__mvp">
            MVP: <strong>{{ userById.get(resultDetails.mvpUserId)?.name ?? 'Игрок' }}</strong>
          </p>
        </section>

        <details v-if="auth.isAdmin && revisions.length > 1" class="match-revisions">
          <summary>История изменений: {{ revisions.length - 1 }}</summary>
          <div v-for="revision in revisions.filter((item) => item.reason === 'updated')" :key="revision.id" class="match-revisions__row">
            <span>{{ formatDateTime(revision.changedAt) }} · {{ userById.get(revision.changedByUserId)?.name ?? 'Администратор' }}</span>
            <strong>Было {{ revision.previousMatch?.score1 ?? '—' }} : {{ revision.previousMatch?.score2 ?? '—' }}</strong>
          </div>
        </details>

        <div class="match-detail-actions">
          <NuxtLink v-if="bracketMatch" class="cta-button cta-button-primary" :to="`/tournaments/${tournament.id}/bracket`">Открыть сетку</NuxtLink>
          <NuxtLink v-else class="cta-button cta-button-primary" :to="`/tournaments/${tournament.id}`">Открыть турнир</NuxtLink>
          <NuxtLink v-if="auth.isAdmin" class="cta-button cta-button-secondary" :to="`/matches/${match.id}/result`">
            {{ isFinished ? 'Изменить результат' : 'Внести результат' }}
          </NuxtLink>
        </div>
      </template>

      <div v-else class="empty-state-panel">
        <h1>Матч не найден</h1>
        <p>Возможно, ссылка устарела или матч ещё не опубликован.</p>
        <NuxtLink class="cta-button cta-button-primary" to="/tournaments">Смотреть турниры</NuxtLink>
      </div>
    </div>
  </section>
</template>
