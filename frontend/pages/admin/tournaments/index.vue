<script setup lang="ts">
import { applicationService, tournamentService } from '~/services'
import type { SportKey, TournamentStatus } from '~/types/domain'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Турниры в админке' })

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
  new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value))

const tournaments = await tournamentService.list()
const applicationsByTournament = new Map(
  await Promise.all(tournaments.map(async (tournament) => [tournament.id, await applicationService.list({ tournamentId: tournament.id })] as const))
)
</script>

<template>
  <section>
    <PageHead title="Турниры" subtitle="Сезоны, дедлайны, заявки команд и текущие статусы." />

    <div class="profile-grid">
      <article v-for="tournament in tournaments" :key="tournament.id" class="profile-card">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">{{ sportLabels[tournament.sport] }}</span>
            <h2>{{ tournament.name }}</h2>
          </div>
          <StatusBadge :status="tournament.status" :label="statusLabels[tournament.status]" />
        </div>

        <dl class="profile-card__meta">
          <div>
            <dt>Старт</dt>
            <dd>{{ formatDate(tournament.eventStartDate) }}</dd>
          </div>
          <div>
            <dt>Заявок</dt>
            <dd>{{ applicationsByTournament.get(tournament.id)?.length ?? 0 }}</dd>
          </div>
          <div>
            <dt>Лимит</dt>
            <dd>{{ tournament.maxTeams }} команд</dd>
          </div>
        </dl>

        <p class="profile-card__note">{{ tournament.description }}</p>

        <div class="profile-card__actions">
          <NuxtLink class="cta-button cta-button-secondary" :to="`/tournaments/${tournament.id}`">Открыть турнир</NuxtLink>
        </div>
      </article>
    </div>
  </section>
</template>
