<script setup lang="ts">
import { applicationService, teamService, tournamentService } from '~/services'
import type { ApplicationStatus, SportKey, TournamentStatus } from '~/types/domain'

definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Мои турниры' })

const auth = useAuthStore()

if (!auth.initialized) {
  await auth.loadCurrentUser()
}

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const applicationStatusLabels: Record<ApplicationStatus, string> = {
  pending: 'Заявка на проверке',
  approved: 'Команда допущена',
  rejected: 'Заявка отклонена',
  excluded: 'Команда исключена'
}

const tournamentStatusLabels: Record<TournamentStatus, string> = {
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

const userTeams = auth.user ? await teamService.listByUser(auth.user.id) : []
const teamById = new Map(userTeams.map((team) => [team.id, team]))
const allTournaments = await tournamentService.list()
const tournamentById = new Map(allTournaments.map((tournament) => [tournament.id, tournament]))
const applications = (
  await Promise.all(userTeams.map((team) => applicationService.list({ teamId: team.id })))
).flat()

const tournamentItems = applications
  .map((application) => ({
    application,
    team: teamById.get(application.teamId),
    tournament: tournamentById.get(application.tournamentId)
  }))
  .filter((item) => item.team && item.tournament)
  .sort((a, b) => (a.tournament?.eventStartDate ?? '').localeCompare(b.tournament?.eventStartDate ?? ''))
</script>

<template>
  <section>
    <PageHead
      title="Мои турниры"
      subtitle="Здесь видны заявки ваших команд, статус допуска и ближайшие даты турниров."
    />

    <div v-if="tournamentItems.length" class="profile-grid">
      <article v-for="item in tournamentItems" :key="item.application.id" class="profile-card">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">{{ sportLabels[item.tournament!.sport] }}</span>
            <h2>{{ item.tournament!.name }}</h2>
          </div>
          <StatusBadge :status="item.application.status" :label="applicationStatusLabels[item.application.status]" />
        </div>

        <dl class="profile-card__meta">
          <div>
            <dt>Команда</dt>
            <dd>{{ item.team!.name }}</dd>
          </div>
          <div>
            <dt>Старт</dt>
            <dd>{{ formatDate(item.tournament!.eventStartDate) }}</dd>
          </div>
          <div>
            <dt>Турнир</dt>
            <dd>{{ tournamentStatusLabels[item.tournament!.status] }}</dd>
          </div>
        </dl>

        <p v-if="item.application.rejectReason" class="profile-card__note">
          Причина: {{ item.application.rejectReason }}
        </p>
        <p v-else-if="item.application.comment" class="profile-card__note">
          Комментарий: {{ item.application.comment }}
        </p>

        <div class="profile-card__actions">
          <NuxtLink class="cta-button cta-button-primary" :to="`/tournaments/${item.tournament!.id}`">Открыть турнир</NuxtLink>
          <NuxtLink class="cta-button cta-button-secondary" :to="`/teams/${item.team!.id}`">Открыть команду</NuxtLink>
        </div>
      </article>
    </div>

    <div v-else class="empty-state-panel">
      <h2>Заявок пока нет</h2>
      <p>Выберите турнир и подайте заявку от команды. После этого турнир появится в этом разделе.</p>
      <div class="empty-state-panel__actions">
        <NuxtLink class="cta-button cta-button-primary" to="/tournaments">Смотреть турниры</NuxtLink>
        <NuxtLink class="cta-button cta-button-secondary" to="/profile/teams">Мои команды</NuxtLink>
      </div>
    </div>
  </section>
</template>
