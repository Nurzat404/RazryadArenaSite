<script setup lang="ts">
import { matchService } from '~/services'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const matchId = String(route.params.id)
const match = await matchService.getById(matchId)

useHead({ title: match && ['finished', 'technical_win'].includes(match.status) ? 'Изменить результат' : match ? 'Внести результат' : 'Матч не найден' })
</script>

<template>
  <section>
    <PageHead :title="match && ['finished', 'technical_win'].includes(match.status) ? 'Изменить результат' : 'Внести результат'" subtitle="Счёт, технические результаты и статистика игроков." />
    <MatchResultEditor v-if="match" :match-id="matchId" />
    <div v-else class="empty-state-panel">
      <h1>Матч не найден</h1>
      <p>Откройте матч из расписания или турнирной сетки.</p>
    </div>
  </section>
</template>
