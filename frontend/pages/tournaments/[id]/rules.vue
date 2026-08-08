<script setup lang="ts">
import { tournamentService } from '~/services'

const route = useRoute()
const tournament = await tournamentService.getById(String(route.params.id))

const ageLabel = computed(() => {
  if (!tournament) return ''
  if (tournament.minAge === undefined && tournament.maxAge === undefined) return 'Без ограничений'
  if (tournament.minAge !== undefined && tournament.maxAge !== undefined) return `${tournament.minAge}–${tournament.maxAge} лет`
  return tournament.minAge !== undefined ? `От ${tournament.minAge} лет` : `До ${tournament.maxAge} лет`
})

useHead({
  title: tournament ? `Правила — ${tournament.name}` : 'Правила турнира',
  meta: tournament ? [{ name: 'description', content: `Правила участия, состав и формат матчей турнира ${tournament.name}.` }] : []
})
</script>

<template>
  <section class="section-padding workspace-page workspace-page--tournament-detail">
    <div class="container">
      <PageHead :title="tournament?.name ?? 'Турнир не найден'" subtitle="Требования к составу и порядок проведения." />

      <template v-if="tournament">
        <TournamentNav :tournament-id="tournament.id" active="rules" />

        <div class="tournament-rules-layout">
          <article class="tournament-rules-main">
            <h2>Правила участия</h2>
            <ol>
              <li v-for="rule in tournament.rules" :key="rule">{{ rule }}</li>
            </ol>
          </article>

          <aside class="tournament-rules-facts">
            <div><span>Состав</span><strong>{{ tournament.requiredTeamSize }} игроков</strong></div>
            <div><span>Возраст</span><strong>{{ ageLabel }}</strong></div>
            <div><span>Формат</span><strong>{{ tournament.matchFormat }}</strong></div>
            <div><span>Проведение</span><strong>{{ tournament.scheduleMode === 'sequential' ? 'Живая очередь' : 'По расписанию' }}</strong></div>
          </aside>
        </div>

        <section v-if="tournament.mapPool?.length" class="tournament-map-pool">
          <h2>Карты</h2>
          <div><span v-for="map in tournament.mapPool" :key="map">{{ map }}</span></div>
        </section>
      </template>

      <div v-else class="empty-state-panel">
        <h2>Турнир не найден</h2>
        <NuxtLink class="cta-button cta-button-primary" to="/tournaments">Смотреть турниры</NuxtLink>
      </div>
    </div>
  </section>
</template>
