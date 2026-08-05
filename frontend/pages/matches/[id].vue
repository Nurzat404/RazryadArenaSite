<script setup lang="ts">
import { bracketService, matchService, teamService, tournamentService } from '~/services'
import type { MatchStatus } from '~/types/domain'

const route = useRoute()
const match = await matchService.getById(String(route.params.id))
const [teams, tournament, bracketMatch] = await Promise.all([
  teamService.list(),
  match ? tournamentService.getById(match.tournamentId) : null,
  match ? bracketService.listByTournament(match.tournamentId).then((items) => items.find((item) => item.matchId === match.id) ?? null) : null
])

const teamById = new Map(teams.map((team) => [team.id, team]))
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

useHead({ title: match && tournament ? `${teamById.get(match.team1Id)?.name ?? 'Матч'} — ${teamById.get(match.team2Id)?.name ?? ''}` : 'Матч' })
</script>

<template>
  <section class="section-padding workspace-page workspace-page--match-detail">
    <div class="container">
      <template v-if="match && tournament">
        <PageHead :title="tournament.name" :subtitle="statusLabels[match.status]" />

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

        <div class="match-detail-actions">
          <NuxtLink v-if="bracketMatch" class="cta-button cta-button-primary" :to="`/tournaments/${tournament.id}/bracket`">Открыть сетку</NuxtLink>
          <NuxtLink v-else class="cta-button cta-button-primary" :to="`/tournaments/${tournament.id}`">Открыть турнир</NuxtLink>
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
