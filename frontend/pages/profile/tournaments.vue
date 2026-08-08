<script setup lang="ts">
import { applicationService, teamService, tournamentService, userService } from '~/services'
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

const [allTeams, allTournaments, rosters, users, allApplications] = await Promise.all([
  teamService.list(),
  tournamentService.list(),
  applicationService.listRosters(),
  userService.list(),
  applicationService.list()
])
const captainTeamIds = new Set(allTeams.filter((team) => team.captainId === auth.user?.id).map((team) => team.id))
const teamById = new Map(allTeams.map((team) => [team.id, team]))
const tournamentById = new Map(allTournaments.map((tournament) => [tournament.id, tournament]))
const rosterByKey = new Map(rosters.map((roster) => [`${roster.tournamentId}:${roster.teamId}`, roster]))
const userById = new Map(users.map((user) => [user.id, user]))
const rosterKeys = new Set(rosters
  .filter((roster) => auth.user && roster.playerIds.includes(auth.user.id))
  .map((roster) => `${roster.tournamentId}:${roster.teamId}`))
const applications = allApplications.filter((application) => (
  captainTeamIds.has(application.teamId)
  || (application.status === 'approved' && rosterKeys.has(`${application.tournamentId}:${application.teamId}`))
))

const tournamentItems = applications
  .map((application) => ({
    application,
    team: teamById.get(application.teamId),
    tournament: tournamentById.get(application.tournamentId),
    roster: rosterByKey.get(`${application.tournamentId}:${application.teamId}`)
  }))
  .filter((item) => item.team && item.tournament)
  .sort((a, b) => (a.tournament?.eventStartDate ?? '').localeCompare(b.tournament?.eventStartDate ?? ''))
</script>

<template>
  <section class="workspace-page workspace-page--profile">
    <PageHead
      title="Мои турниры"
      subtitle="Заявки ваших команд и турниры, в которых вы играете."
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
          <div>
            <dt>Состав</dt>
            <dd>{{ item.roster?.playerIds.length ?? 0 }} игроков</dd>
          </div>
          <div>
            <dt>Капитан на турнире</dt>
            <dd>{{ userById.get(item.roster?.captainId ?? '')?.name ?? 'Не назначен' }}</dd>
          </div>
        </dl>

        <p v-if="item.application.rejectReason" class="profile-card__note">
          Причина: {{ item.application.rejectReason }}
        </p>
        <p v-else-if="item.application.comment" class="profile-card__note">
          Комментарий: {{ item.application.comment }}
        </p>

        <div class="profile-card__actions">
          <NuxtLink class="cta-button cta-button-primary" :to="`/tournaments/${item.tournament!.id}/applications/${item.application.id}`">Открыть заявку</NuxtLink>
          <NuxtLink class="cta-button cta-button-secondary" :to="`/tournaments/${item.tournament!.id}`">Открыть турнир</NuxtLink>
        </div>
      </article>
    </div>

    <div v-else class="empty-state-panel">
      <h2>Заявок пока нет</h2>
      <p>Здесь будут заявки ваших команд и решения организатора.</p>
      <div class="empty-state-panel__actions">
        <NuxtLink class="cta-button cta-button-primary" to="/tournaments">Смотреть турниры</NuxtLink>
      </div>
    </div>
  </section>
</template>
