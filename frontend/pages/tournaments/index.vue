<script setup lang="ts">
import { tournamentService } from '~/services/tournamentService'

useHead({ title: 'Турниры' })

const tournaments = await tournamentService.list()
</script>

<template>
  <section class="section-padding">
    <div class="container">
      <PageHead title="Турниры" subtitle="Стартовый Nuxt-раздел турниров на мок-данных." />
      <div class="row g-3">
        <div v-for="tournament in tournaments" :key="tournament.id" class="col-lg-6">
          <article class="entity-card">
            <span class="status-badge is-active mb-3">{{ tournament.status }}</span>
            <h2 class="h4">{{ tournament.name }}</h2>
            <p class="text-muted-strong">{{ tournament.description }}</p>
            <div class="d-flex flex-wrap gap-2 text-muted-strong mb-3">
              <span>{{ tournament.city }}</span>
              <span>Команда: {{ tournament.requiredTeamSize }}</span>
              <span>Лимит: {{ tournament.maxTeams }}</span>
            </div>
            <NuxtLink class="cta-button cta-button-secondary" :to="`/tournaments/${tournament.id}`">
              Подробнее
            </NuxtLink>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
