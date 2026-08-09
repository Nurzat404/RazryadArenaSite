<script setup lang="ts">
import { statsService, userService } from '~/services'
import type { PlayerStats, SportKey } from '~/types/domain'

const route = useRoute()
const playerId = String(route.params.id)
const sportKeys: SportKey[] = ['cs2', 'football', 'basketball', 'volleyball']
const sportLabels: Record<SportKey, string> = { cs2: 'CS2', football: 'Футбол', basketball: 'Баскетбол', volleyball: 'Волейбол' }

const [player, allStats] = await Promise.all([
  userService.getById(playerId),
  statsService.list({ userId: playerId })
])

const availableSports = [...new Set([...(player?.favoriteSports ?? []), ...allStats.map((item) => item.sport)])]
const querySport = String(route.query.sport ?? '') as SportKey
const selectedSport = ref<SportKey>(availableSports.includes(querySport) ? querySport : availableSports[0] ?? 'cs2')
const tabs = availableSports.map((sport) => ({ value: sport, label: sportLabels[sport] }))
const statsBySport = new Map(allStats.map((item) => [item.sport, item]))
const trendBySport = new Map(await Promise.all(availableSports.map(async (sport) => [sport, await statsService.ratingTrend(playerId, sport)] as const)))

const current = computed(() => statsBySport.get(selectedSport.value))
const trend = computed(() => trendBySport.get(selectedSport.value) ?? [])
const trendBounds = computed(() => {
  const values = trend.value.map((item) => item.value)
  return { min: Math.min(...values, 0), max: Math.max(...values, 1) }
})
const barHeight = (value: number) => {
  const range = Math.max(trendBounds.value.max - trendBounds.value.min, 1)
  return `${35 + ((value - trendBounds.value.min) / range) * 65}%`
}
const winRate = (item?: PlayerStats) => item?.matchesPlayed ? Math.round((item.wins / item.matchesPlayed) * 100) : 0
const kd = (item?: PlayerStats) => item?.cs2Deaths ? ((item.cs2Kills ?? 0) / item.cs2Deaths).toFixed(2) : '—'

const sportMetrics = computed(() => {
  const item = current.value
  if (!item) return []
  if (selectedSport.value === 'cs2') return [
    ['Убийства', item.cs2Kills ?? 0], ['Смерти', item.cs2Deaths ?? 0], ['Передачи', item.cs2Assists ?? 0],
    ['K/D', kd(item)], ['ADR', item.cs2Adr ?? '—'], ['HS', item.cs2HeadshotPercent !== undefined ? `${item.cs2HeadshotPercent}%` : '—'],
    ['Рейтинг матча', item.cs2PlayerRating ?? '—'], ['MVP', item.mvpCount ?? 0]
  ]
  if (selectedSport.value === 'football') return [['Голы', item.goals ?? 0], ['Голевые передачи', item.assists ?? 0], ['MVP', item.mvpCount ?? 0]]
  if (selectedSport.value === 'basketball') return [['Очки', item.points ?? 0], ['Подборы', item.rebounds ?? 0], ['Фолы', item.fouls ?? 0], ['MVP', item.mvpCount ?? 0]]
  return [['Выигранные сеты', item.setsWon ?? 0], ['Эйсы', item.aces ?? 0], ['Очки', item.points ?? 0], ['MVP', item.mvpCount ?? 0]]
})

useHead(() => ({
  title: player ? `Показатели ${player.name}` : 'Игрок не найден',
  meta: player ? [{ name: 'description', content: `Матчи и игровые показатели ${player.name} по видам спорта.` }] : []
}))
</script>

<template>
  <section class="section-padding workspace-page workspace-page--player">
    <div class="container">
      <template v-if="player">
        <PlayerHeader :player="player" />
        <PlayerNav :player-id="player.id" active="stats" />

        <div v-if="tabs.length" class="player-sport-tabs">
          <BaseTabs v-model="selectedSport" :tabs="tabs" aria-label="Вид спорта" />
        </div>

        <template v-if="current">
          <section class="player-stats-lead" aria-label="Основные показатели">
            <div><span>Матчи</span><strong>{{ current.matchesPlayed }}</strong></div>
            <div><span>Победы</span><strong>{{ current.wins }}</strong></div>
            <div><span>Поражения</span><strong>{{ current.losses }}</strong></div>
            <div><span>Процент побед</span><strong>{{ winRate(current) }}%</strong></div>
            <div class="player-stats-lead__rating"><span>Рейтинг</span><strong>{{ current.rating }}</strong></div>
          </section>

          <div class="player-stats-layout">
            <section class="player-performance" aria-labelledby="performance-title">
              <div class="player-section-head">
                <div><span>{{ sportLabels[selectedSport] }}</span><h2 id="performance-title">Игровые показатели</h2></div>
              </div>
              <dl class="player-metric-table">
                <div v-for="metric in sportMetrics" :key="String(metric[0])">
                  <dt>{{ metric[0] }}</dt><dd>{{ metric[1] }}</dd>
                </div>
              </dl>
            </section>

            <section class="player-rating-chart" aria-labelledby="rating-form-title">
              <div class="player-section-head">
                <div><span>Последние подтверждённые матчи</span><h2 id="rating-form-title">Изменение рейтинга</h2></div>
              </div>
              <div v-if="trend.length" class="player-rating-chart__plot">
                <NuxtLink v-for="point in trend" :key="point.matchId" :to="`/matches/${point.matchId}`" :class="`is-${point.outcome}`">
                  <strong>{{ point.value }}</strong>
                  <i :style="{ height: barHeight(point.value) }"></i>
                  <span>{{ point.label }}</span>
                </NuxtLink>
              </div>
              <p v-else class="player-empty-copy">Для графика нужны матчи с подробными результатами.</p>
            </section>
          </div>
        </template>

        <div v-else class="empty-state-panel">
          <h2>По этому спорту пока нет результатов</h2>
          <p>Показатели появятся после подтверждения первого матча.</p>
        </div>
      </template>
      <div v-else class="empty-state-panel"><h1>Игрок не найден</h1><p>Проверьте ссылку на профиль.</p></div>
    </div>
  </section>
</template>
