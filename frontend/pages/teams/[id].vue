<script setup lang="ts">
import { teamService } from '~/services/teamService'

const route = useRoute()
const team = await teamService.getById(String(route.params.id))

useHead({
  title: team?.name ?? 'Команда'
})
</script>

<template>
  <section class="section-padding">
    <div class="container">
      <PageHead :title="team?.name ?? 'Команда не найдена'" subtitle="Состав, город, рейтинг и статус набора игроков." />
      <div v-if="team" class="surface-panel p-4">
        <p>Спорт: {{ team.sport }}</p>
        <p>Город: {{ team.city }}</p>
        <p>Рейтинг: {{ team.rating }}</p>
        <p class="mb-0">Открыта для заявок: {{ team.isOpenForRequests ? 'да' : 'нет' }}</p>
      </div>
    </div>
  </section>
</template>
