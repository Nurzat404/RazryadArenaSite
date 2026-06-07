<script setup lang="ts">
import { tournamentService } from '~/services/tournamentService'

const route = useRoute()
const tournament = await tournamentService.getById(String(route.params.id))

useHead({
  title: tournament?.name ?? 'Турнир'
})
</script>

<template>
  <section class="section-padding">
    <div class="container">
      <PageHead
        :title="tournament?.name ?? 'Турнир не найден'"
        :subtitle="tournament?.description ?? 'Проверьте ссылку на турнир.'"
      />
      <div v-if="tournament" class="surface-panel p-4">
        <div class="row g-3">
          <div class="col-md-3">
            <strong>Спорт</strong>
            <p class="text-muted-strong mb-0">{{ tournament.sport }}</p>
          </div>
          <div class="col-md-3">
            <strong>Город</strong>
            <p class="text-muted-strong mb-0">{{ tournament.city }}</p>
          </div>
          <div class="col-md-3">
            <strong>Регистрация до</strong>
            <p class="text-muted-strong mb-0">{{ tournament.registrationEndDate }}</p>
          </div>
          <div class="col-md-3">
            <strong>Старт</strong>
            <p class="text-muted-strong mb-0">{{ tournament.eventStartDate }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
