<script setup lang="ts">
import { matchService } from '~/services'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const auth = useAuthStore()
const matchId = String(route.params.id)
const match = await matchService.getById(matchId)

useHead({
  title: match && ['finished', 'technical_win'].includes(match.status) ? 'Изменить результат' : match ? 'Внести результат' : 'Матч не найден',
  meta: [{ name: 'description', content: 'Ввод счёта, технического результата и статистики матча.' }]
})
</script>

<template>
  <section class="section-padding workspace-page workspace-page--match-result">
    <div class="container">
      <PageHead
        :title="match && ['finished', 'technical_win'].includes(match.status) ? 'Изменить результат' : 'Внести результат'"
        subtitle="Проверьте счёт перед сохранением: он сразу попадёт в сетку турнира."
      />

      <MatchResultEditor v-if="auth.isAdmin && match" :match-id="matchId" />

      <div v-else-if="match" class="empty-state-panel">
        <h1>Нет доступа к результату</h1>
        <p>Сейчас результат может внести администратор турнира.</p>
        <NuxtLink class="cta-button cta-button-primary" :to="`/matches/${match.id}`">К матчу</NuxtLink>
      </div>

      <div v-else class="empty-state-panel">
        <h1>Матч не найден</h1>
        <p>Проверьте ссылку и попробуйте открыть матч из расписания или сетки.</p>
      </div>
    </div>
  </section>
</template>
