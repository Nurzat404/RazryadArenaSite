<script setup lang="ts">
import { teamService } from '~/services/teamService'

useHead({ title: 'Команды' })

const teams = await teamService.list()
</script>

<template>
  <section class="section-padding">
    <div class="container">
      <PageHead title="Команды" subtitle="Раздел команд подготовлен к расширению: заявки, составы, инвайты и капитаны." />
      <div class="row g-3">
        <div v-for="team in teams" :key="team.id" class="col-lg-6">
          <article class="entity-card">
            <h2 class="h4">{{ team.name }}</h2>
            <p class="text-muted-strong mb-2">{{ team.city }} · {{ team.sport }}</p>
            <p class="mb-3">Участников: {{ team.memberIds.length }} / {{ team.maxMembers }}</p>
            <NuxtLink class="cta-button cta-button-secondary" :to="`/teams/${team.id}`">
              Открыть команду
            </NuxtLink>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
