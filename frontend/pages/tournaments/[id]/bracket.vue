<script setup lang="ts">
import { bracketService, matchService, teamService, tournamentService } from '~/services'
import type { BracketMatch, Match, MatchStatus } from '~/types/domain'

const route = useRoute()
const tournamentId = String(route.params.id)
const [tournament, bracketMatches, matches, teams] = await Promise.all([
  tournamentService.getById(tournamentId),
  bracketService.listByTournament(tournamentId),
  matchService.list({ tournamentId }),
  teamService.list()
])

const teamById = new Map(teams.map((team) => [team.id, team]))
const matchById = new Map(matches.map((match) => [match.id, match]))
const rounds = computed(() => {
  const matchesByRound = new Map<number, BracketMatch[]>()
  bracketMatches.filter((bracketMatch) => !bracketMatch.isThirdPlace).forEach((bracketMatch) => {
    matchesByRound.set(bracketMatch.round, [...(matchesByRound.get(bracketMatch.round) ?? []), bracketMatch])
  })

  return [...matchesByRound.entries()].sort(([roundA], [roundB]) => roundA - roundB).map(([round, matches]) => ({
    round,
    name: matches[0]?.roundName ?? 'Раунд',
    matches: [...matches].sort((matchA, matchB) => matchA.position - matchB.position)
  }))
})
const thirdPlaceMatches = computed(() => bracketMatches
  .filter((bracketMatch) => bracketMatch.isThirdPlace)
  .sort((matchA, matchB) => matchA.position - matchB.position))
const bracketGridStyle = computed(() => ({
  '--bracket-slots': Math.max(1, ...rounds.value.map((round) => round.matches.length)),
  '--bracket-rounds': rounds.value.length
}))

const statusLabels: Record<BracketMatch['status'], string> = {
  pending: 'Ждёт соперника',
  scheduled: 'Матч назначен',
  finished: 'Матч завершён'
}

const matchStatusLabels: Record<MatchStatus, string> = {
  scheduled: 'Матч назначен',
  active: 'Идёт сейчас',
  finished: 'Матч завершён',
  technical_win: 'Технический результат'
}

const teamName = (teamId: string | undefined, bracketMatch: BracketMatch) => {
  if (!teamId) return bracketMatch.isBye ? 'BYE' : 'Соперник определится позже'
  return teamById.get(teamId)?.name ?? 'Команда не найдена'
}

const score = (match: Match | undefined, side: 1 | 2) => match?.[`score${side}`] ?? '—'
const isWinner = (bracketMatch: BracketMatch, teamId: string | undefined) => Boolean(
  teamId && bracketMatch.winnerId === teamId
)
const matchLabel = (bracketMatch: BracketMatch) => {
  const match = bracketMatch.matchId ? matchById.get(bracketMatch.matchId) : undefined
  return match ? matchStatusLabels[match.status] : statusLabels[bracketMatch.status]
}

useHead({
  title: tournament ? `Сетка — ${tournament.name}` : 'Турнирная сетка',
  meta: tournament ? [{ name: 'description', content: `Сетка турнира ${tournament.name}: пары, результаты и следующие матчи.` }] : []
})
</script>

<template>
  <section class="section-padding workspace-page workspace-page--tournament-detail">
    <div class="container">
      <PageHead
        :title="tournament?.name ?? 'Турнир не найден'"
        :subtitle="tournament ? 'Сетка, пары и результаты матчей.' : 'Проверьте адрес страницы или вернитесь к списку турниров.'"
      />

      <template v-if="tournament">
        <TournamentNav :tournament-id="tournament.id" active="bracket" />

        <section v-if="rounds.length" class="bracket-board" aria-label="Турнирная сетка">
          <div class="bracket-board__scroll" :style="bracketGridStyle">
            <div class="bracket-rounds">
              <section
                v-for="(round, roundIndex) in rounds"
                :key="round.round"
                class="bracket-round"
                :class="{ 'bracket-round--last': roundIndex === rounds.length - 1 }"
              >
                <h2>{{ round.name }}</h2>
                <div class="bracket-round__matches">
                  <div v-for="bracketMatch in round.matches" :key="bracketMatch.id" class="bracket-round__slot">
                    <NuxtLink
                      v-if="bracketMatch.matchId"
                      class="bracket-match"
                      :class="{ 'bracket-match--finished': bracketMatch.status === 'finished' }"
                      :to="`/matches/${bracketMatch.matchId}`"
                    >
                      <span class="bracket-match__state">{{ matchLabel(bracketMatch) }}</span>
                      <div class="bracket-match__team" :class="{ 'is-winner': isWinner(bracketMatch, bracketMatch.team1Id) }">
                        <strong>{{ teamName(bracketMatch.team1Id, bracketMatch) }}</strong>
                        <b>{{ score(matchById.get(bracketMatch.matchId), 1) }}</b>
                      </div>
                      <div class="bracket-match__team" :class="{ 'is-winner': isWinner(bracketMatch, bracketMatch.team2Id) }">
                        <strong>{{ teamName(bracketMatch.team2Id, bracketMatch) }}</strong>
                        <b>{{ score(matchById.get(bracketMatch.matchId), 2) }}</b>
                      </div>
                    </NuxtLink>

                    <article
                      v-else
                      class="bracket-match"
                      :class="{ 'bracket-match--finished': bracketMatch.status === 'finished' }"
                    >
                      <span class="bracket-match__state">{{ matchLabel(bracketMatch) }}</span>
                      <div class="bracket-match__team" :class="{ 'is-winner': isWinner(bracketMatch, bracketMatch.team1Id) }">
                        <strong>{{ teamName(bracketMatch.team1Id, bracketMatch) }}</strong>
                        <b>—</b>
                      </div>
                      <div class="bracket-match__team" :class="{ 'is-winner': isWinner(bracketMatch, bracketMatch.team2Id) }">
                        <strong>{{ teamName(bracketMatch.team2Id, bracketMatch) }}</strong>
                        <b>—</b>
                      </div>
                    </article>
                  </div>
                </div>
              </section>
            </div>

            <section v-if="thirdPlaceMatches.length" class="bracket-placement">
              <h2>Матч за 3-е место</h2>
              <div class="bracket-placement__matches">
                <template v-for="bracketMatch in thirdPlaceMatches" :key="bracketMatch.id">
                  <NuxtLink
                    v-if="bracketMatch.matchId"
                    class="bracket-match bracket-match--third"
                    :to="`/matches/${bracketMatch.matchId}`"
                  >
                    <span class="bracket-match__state">{{ matchLabel(bracketMatch) }}</span>
                    <div class="bracket-match__team" :class="{ 'is-winner': isWinner(bracketMatch, bracketMatch.team1Id) }">
                      <strong>{{ teamName(bracketMatch.team1Id, bracketMatch) }}</strong>
                      <b>{{ score(matchById.get(bracketMatch.matchId), 1) }}</b>
                    </div>
                    <div class="bracket-match__team" :class="{ 'is-winner': isWinner(bracketMatch, bracketMatch.team2Id) }">
                      <strong>{{ teamName(bracketMatch.team2Id, bracketMatch) }}</strong>
                      <b>{{ score(matchById.get(bracketMatch.matchId), 2) }}</b>
                    </div>
                  </NuxtLink>
                  <article v-else class="bracket-match bracket-match--third">
                    <span class="bracket-match__state">{{ matchLabel(bracketMatch) }}</span>
                    <div class="bracket-match__team" :class="{ 'is-winner': isWinner(bracketMatch, bracketMatch.team1Id) }">
                      <strong>{{ teamName(bracketMatch.team1Id, bracketMatch) }}</strong>
                      <b>—</b>
                    </div>
                    <div class="bracket-match__team" :class="{ 'is-winner': isWinner(bracketMatch, bracketMatch.team2Id) }">
                      <strong>{{ teamName(bracketMatch.team2Id, bracketMatch) }}</strong>
                      <b>—</b>
                    </div>
                  </article>
                </template>
              </div>
            </section>
          </div>
        </section>

        <div v-else class="empty-state-panel">
          <h2>Сетка ещё не опубликована</h2>
          <p>Организатор добавит пары после завершения регистрации.</p>
          <NuxtLink class="cta-button cta-button-primary" :to="`/tournaments/${tournament.id}`">К турниру</NuxtLink>
        </div>
      </template>

      <div v-else class="empty-state-panel">
        <h2>Турнир не найден</h2>
        <NuxtLink class="cta-button cta-button-primary" to="/tournaments">Смотреть турниры</NuxtLink>
      </div>
    </div>
  </section>
</template>
