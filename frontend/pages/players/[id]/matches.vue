<script setup lang="ts">
import { statsService, userService } from '~/services'
import type { PlayerMatchHistoryItem } from '~/services/statsService'
import type { SportKey } from '~/types/domain'

type SportFilter = 'all' | SportKey
const route = useRoute()
const playerId = String(route.params.id)
const sportLabels: Record<SportKey, string> = { cs2: 'CS2', football: 'Футбол', basketball: 'Баскетбол', volleyball: 'Волейбол' }
const outcomeLabels = { upcoming: 'Предстоит', live: 'Идёт', win: 'Победа', loss: 'Поражение', draw: 'Ничья' } as const

const [player, matches] = await Promise.all([userService.getById(playerId), statsService.matchesByUser(playerId)])
const sports = [...new Set(matches.map((item) => item.match.sport))]
const selectedSport = ref<SportFilter>('all')
const tabs = [{ value: 'all' as const, label: 'Все' }, ...sports.map((sport) => ({ value: sport, label: sportLabels[sport] }))]
const filtered = computed(() => matches.filter((item) => selectedSport.value === 'all' || item.match.sport === selectedSport.value))
const upcoming = computed(() => filtered.value.filter((item) => ['upcoming', 'live'].includes(item.outcome)).sort((a, b) => a.match.scheduledAt.localeCompare(b.match.scheduledAt)))
const completed = computed(() => filtered.value.filter((item) => ['win', 'loss', 'draw'].includes(item.outcome)))

const formatDate = (value: string) => new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
const statLine = (item: PlayerMatchHistoryItem) => {
  const stat = item.playerStat
  if (!stat) return ''
  if (item.match.sport === 'cs2') return `${stat.kills ?? 0}–${stat.deaths ?? 0}–${stat.assists ?? 0} · ADR ${stat.adr ?? '—'}`
  if (item.match.sport === 'football') return `Голы ${stat.goals ?? 0} · передачи ${stat.assists ?? 0}`
  if (item.match.sport === 'basketball') return `${stat.points ?? 0} очков · ${stat.rebounds ?? 0} подборов`
  return `${stat.setsWon ?? 0} сетов · ${stat.aces ?? 0} эйсов`
}

useHead(() => ({
  title: player ? `Матчи ${player.name}` : 'Игрок не найден',
  meta: player ? [{ name: 'description', content: `Ближайшие и сыгранные матчи ${player.name}.` }] : []
}))
</script>

<template>
  <section class="section-padding workspace-page workspace-page--player">
    <div class="container">
      <template v-if="player">
        <PlayerHeader :player="player" />
        <PlayerNav :player-id="player.id" active="matches" />
        <div v-if="sports.length > 1" class="player-sport-tabs"><BaseTabs v-model="selectedSport" :tabs="tabs" aria-label="Фильтр матчей по спорту" /></div>

        <div v-if="filtered.length" class="player-match-history">
          <section v-if="upcoming.length" aria-labelledby="upcoming-title">
            <div class="player-section-head"><div><span>Расписание</span><h2 id="upcoming-title">Ближайшие матчи</h2></div></div>
            <article v-for="item in upcoming" :key="item.match.id" class="player-history-row">
              <div class="player-history-row__date"><span>{{ sportLabels[item.match.sport] }}</span><time>{{ formatDate(item.match.scheduledAt) }}</time></div>
              <div class="player-history-row__match">
                <small>{{ item.tournamentName }}</small>
                <div><NuxtLink :to="`/teams/${item.teamId}`">{{ item.teamName }}</NuxtLink><span>—</span><NuxtLink :to="`/teams/${item.opponentId}`">{{ item.opponentName }}</NuxtLink></div>
                <p>{{ item.match.location }}</p>
              </div>
              <span :class="`player-outcome is-${item.outcome}`">{{ outcomeLabels[item.outcome] }}</span>
              <NuxtLink class="player-history-row__open" :to="`/matches/${item.match.id}`">Открыть матч</NuxtLink>
            </article>
          </section>

          <section v-if="completed.length" aria-labelledby="completed-title">
            <div class="player-section-head"><div><span>Результаты</span><h2 id="completed-title">Сыгранные матчи</h2></div></div>
            <article v-for="item in completed" :key="item.match.id" class="player-history-row player-history-row--result">
              <div class="player-history-row__date"><span>{{ sportLabels[item.match.sport] }}</span><time>{{ formatDate(item.match.scheduledAt) }}</time></div>
              <div class="player-history-row__match">
                <small>{{ item.tournamentName }}</small>
                <div><NuxtLink :to="`/teams/${item.teamId}`">{{ item.teamName }}</NuxtLink><strong>{{ item.scoreFor }}:{{ item.scoreAgainst }}</strong><NuxtLink :to="`/teams/${item.opponentId}`">{{ item.opponentName }}</NuxtLink></div>
                <p v-if="statLine(item)">{{ statLine(item) }}<b v-if="item.isMvp">MVP</b></p>
              </div>
              <span :class="`player-outcome is-${item.outcome}`">{{ outcomeLabels[item.outcome] }}</span>
              <NuxtLink class="player-history-row__open" :to="`/matches/${item.match.id}`">Открыть матч</NuxtLink>
            </article>
          </section>
        </div>

        <div v-else class="empty-state-panel"><h2>Матчей пока нет</h2><p>Игры появятся после включения игрока в турнирный состав.</p></div>
      </template>
      <div v-else class="empty-state-panel"><h1>Игрок не найден</h1><p>Проверьте ссылку на профиль.</p></div>
    </div>
  </section>
</template>
