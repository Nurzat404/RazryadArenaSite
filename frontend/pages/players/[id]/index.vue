<script setup lang="ts">
import { statsService, teamService, userService } from '~/services'
import type { PlayerStats, SportKey } from '~/types/domain'

const route = useRoute()
const playerId = String(route.params.id)

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const [player, teams, stats, matches] = await Promise.all([
  userService.getById(playerId),
  teamService.listByUser(playerId),
  statsService.list({ userId: playerId }),
  statsService.matchesByUser(playerId)
])

const totalMatches = stats.reduce((sum, item) => sum + item.matchesPlayed, 0)
const totalWins = stats.reduce((sum, item) => sum + item.wins, 0)
const bestRating = stats.reduce((best, item) => Math.max(best, item.rating), 0)
const recentForm = matches.filter((item) => ['win', 'loss', 'draw'].includes(item.outcome)).slice(0, 5)

const winRate = (item: PlayerStats) => item.matchesPlayed ? Math.round((item.wins / item.matchesPlayed) * 100) : 0

useHead(() => ({
  title: player ? `${player.name} — игрок` : 'Игрок не найден',
  meta: player ? [{ name: 'description', content: `${player.name}: команды, матчи и спортивная статистика.` }] : []
}))
</script>

<template>
  <section class="section-padding workspace-page workspace-page--player">
    <div class="container">
      <template v-if="player">
        <PlayerHeader :player="player" />
        <PlayerNav :player-id="player.id" active="overview" />

        <div class="player-overview">
          <section class="player-scoreboard" aria-label="Сводка игрока">
            <div><strong>{{ totalMatches }}</strong><span>Матчи</span></div>
            <div><strong>{{ totalWins }}</strong><span>Победы</span></div>
            <div><strong>{{ totalMatches ? Math.round((totalWins / totalMatches) * 100) : 0 }}%</strong><span>Побед</span></div>
            <div><strong>{{ bestRating || '—' }}</strong><span>Лучший рейтинг</span></div>
          </section>

          <section class="player-sport-summary" aria-labelledby="player-sports-title">
            <div class="player-section-head">
              <div><span>По видам спорта</span><h2 id="player-sports-title">Результаты</h2></div>
              <NuxtLink :to="`/players/${player.id}/stats`">Все показатели</NuxtLink>
            </div>
            <div v-if="stats.length" class="player-sport-list">
              <NuxtLink v-for="item in stats" :key="item.id" :to="{ path: `/players/${player.id}/stats`, query: { sport: item.sport } }">
                <strong>{{ sportLabels[item.sport] }}</strong>
                <span>{{ item.matchesPlayed }} матчей</span>
                <span>{{ item.wins }}–{{ item.losses }}</span>
                <span>{{ winRate(item) }}% побед</span>
                <b>{{ item.rating }}</b>
              </NuxtLink>
            </div>
            <p v-else class="player-empty-copy">Подтверждённых результатов пока нет.</p>
          </section>

          <aside class="player-form-panel" aria-labelledby="player-form-title">
            <div class="player-section-head">
              <div><span>Последние игры</span><h2 id="player-form-title">Форма</h2></div>
              <NuxtLink :to="`/players/${player.id}/matches`">Матчи</NuxtLink>
            </div>
            <div v-if="recentForm.length" class="player-form-strip">
              <NuxtLink
                v-for="item in recentForm"
                :key="item.match.id"
                :class="`is-${item.outcome}`"
                :to="`/matches/${item.match.id}`"
                :title="`${item.teamName} — ${item.opponentName}`"
              >
                {{ item.outcome === 'win' ? 'В' : item.outcome === 'loss' ? 'П' : 'Н' }}
              </NuxtLink>
            </div>
            <p v-else class="player-empty-copy">Сыгранных матчей пока нет.</p>
          </aside>

          <section class="player-team-panel" aria-labelledby="player-teams-title">
            <div class="player-section-head">
              <div><span>Текущие составы</span><h2 id="player-teams-title">Команды</h2></div>
            </div>
            <div v-if="teams.length" class="player-team-list">
              <NuxtLink v-for="team in teams" :key="team.id" :to="`/teams/${team.id}`">
                <span>{{ sportLabels[team.sport] }}</span>
                <strong>{{ team.name }}</strong>
                <small>{{ team.city }}</small>
                <b>{{ team.rating }}</b>
              </NuxtLink>
            </div>
            <p v-else class="player-empty-copy">Игрок пока не состоит в командах.</p>
          </section>
        </div>
      </template>

      <div v-else class="empty-state-panel">
        <h1>Игрок не найден</h1>
        <p>Возможно, профиль удалён или ссылка устарела.</p>
        <NuxtLink class="cta-button cta-button-primary" to="/ratings">Открыть рейтинг</NuxtLink>
      </div>
    </div>
  </section>
</template>
