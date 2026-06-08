<script setup lang="ts">
import { applicationService, tournamentService } from '~/services'
import type { SportKey, TournamentStatus } from '~/types/domain'

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const statusLabels: Record<TournamentStatus, string> = {
  draft: 'Готовится',
  registration_open: 'Идут заявки',
  registration_closed: 'Заявки закрыты',
  active: 'Идёт турнир',
  finished: 'Завершён'
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(value))

const tournaments = await tournamentService.list()
const applicationsByTournament = new Map(
  await Promise.all(tournaments.map(async (tournament) => [
    tournament.id,
    await applicationService.list({ tournamentId: tournament.id })
  ] as const))
)

useHead({
  title: 'Турниры — РазрядАрена',
  bodyAttrs: {
    class: 'layout-public',
    'data-page': 'tournaments',
    'data-role': 'public'
  }
})
</script>

<template>
  <div class="section-padding">
    <div class="container">
      <div class="page-head">
        <h1 class="section-title">Турниры</h1>
        <p class="section-subtitle">
          Даты, дисциплины, заявки и требования к составу. Сначала смотрите условия, потом собирайте команду.
        </p>
      </div>

      <section class="filter-panel mb-3" aria-label="Фильтры турниров">
        <div class="d-flex flex-wrap gap-2">
          <span class="filter-chip is-active">Все дисциплины</span>
          <span class="filter-chip">CS2</span>
          <span class="filter-chip">Футбол</span>
          <span class="filter-chip">Баскетбол</span>
          <span class="filter-chip">Волейбол</span>
        </div>
      </section>

      <div class="profile-grid">
        <article v-for="tournament in tournaments" :key="tournament.id" class="profile-card">
          <div class="profile-card__head">
            <div>
              <span class="profile-card__badge">{{ sportLabels[tournament.sport] }}</span>
              <h2>{{ tournament.name }}</h2>
            </div>
            <StatusBadge :status="tournament.status" :label="statusLabels[tournament.status]" />
          </div>

          <p class="profile-card__note">{{ tournament.description }}</p>

          <dl class="profile-card__meta">
            <div>
              <dt>Старт</dt>
              <dd>{{ formatDate(tournament.eventStartDate) }}</dd>
            </div>
            <div>
              <dt>Состав</dt>
              <dd>{{ tournament.requiredTeamSize }} игроков</dd>
            </div>
            <div>
              <dt>Заявок</dt>
              <dd>{{ applicationsByTournament.get(tournament.id)?.length ?? 0 }}/{{ tournament.maxTeams }}</dd>
            </div>
          </dl>

          <div class="profile-card__actions">
            <NuxtLink class="cta-button cta-button-primary" :to="`/tournaments/${tournament.id}`">Открыть турнир</NuxtLink>
            <NuxtLink class="cta-button cta-button-secondary" to="/teams">Найти команду</NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
