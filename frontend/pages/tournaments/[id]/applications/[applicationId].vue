<script setup lang="ts">
import { applicationService, teamService, tournamentService, userService } from '~/services'
import type { ApplicationStatus } from '~/types/domain'

definePageMeta({ layout: 'app', middleware: 'auth' })

const route = useRoute()
const auth = useAuthStore()
if (!auth.initialized) await auth.loadCurrentUser()

const tournamentId = String(route.params.id)
const applicationId = String(route.params.applicationId)
const application = await applicationService.getById(applicationId)
const [tournament, team, roster, users] = await Promise.all([
  tournamentService.getById(tournamentId),
  application ? teamService.getById(application.teamId) : null,
  application ? applicationService.getRoster(tournamentId, application.teamId) : null,
  userService.list()
])
const userById = new Map(users.map((user) => [user.id, user]))
const canView = Boolean(
  application
  && application.tournamentId === tournamentId
  && auth.user
  && (
    auth.isAdmin
    || team?.captainId === auth.user.id
    || roster?.playerIds.includes(auth.user.id)
  )
)

const statusLabels: Record<ApplicationStatus, string> = {
  pending: 'Ждёт решения',
  approved: 'Команда допущена',
  rejected: 'Заявка отклонена',
  excluded: 'Команда исключена'
}
const formatDate = (value: string) => new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
}).format(new Date(value))

useHead({ title: tournament ? `Заявка — ${tournament.name}` : 'Заявка не найдена' })
</script>

<template>
  <section class="workspace-page workspace-page--tournament-detail">
    <PageHead
      :title="canView && tournament ? `Заявка на ${tournament.name}` : 'Заявка недоступна'"
      :subtitle="canView && team ? team.name : 'Проверьте ссылку или откройте заявку из раздела «Мои турниры».'"
    />

    <template v-if="canView && application && tournament && team && roster">
      <TournamentNav :tournament-id="tournament.id" active="overview" />
      <article class="form-panel profile-edit-form">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">{{ statusLabels[application.status] }}</span>
            <h2>{{ team.name }}</h2>
          </div>
          <StatusBadge :status="application.status" :label="statusLabels[application.status]" />
        </div>

        <dl class="profile-card__meta">
          <div><dt>Отправлена</dt><dd>{{ formatDate(application.createdAt) }}</dd></div>
          <div><dt>Обновлена</dt><dd>{{ formatDate(application.updatedAt) }}</dd></div>
          <div><dt>Капитан на турнире</dt><dd>{{ userById.get(roster.captainId)?.name ?? 'Не назначен' }}</dd></div>
          <div><dt>Состав</dt><dd>{{ roster.playerIds.length }} игроков</dd></div>
        </dl>

        <section class="form-section">
          <h3 class="form-section__title">Заявочный состав</h3>
          <div class="team-list-stack">
            <div v-for="userId in roster.playerIds" :key="userId" class="team-list-row">
              <strong>{{ userById.get(userId)?.name ?? 'Игрок не найден' }}</strong>
              <span>{{ userId === roster.captainId ? 'Капитан' : 'Игрок' }}</span>
            </div>
          </div>
        </section>

        <p v-if="application.comment" class="profile-card__note">Комментарий: {{ application.comment }}</p>
        <p v-if="application.rejectReason" class="form-error">Причина отказа: {{ application.rejectReason }}</p>

        <div class="profile-form-actions">
          <NuxtLink
            v-if="application.status === 'rejected' && application.reapplyAllowed && tournament.status === 'registration_open'"
            class="cta-button cta-button-primary"
            :to="`/tournaments/${tournament.id}/apply?team=${team.id}`"
          >Подать заново</NuxtLink>
          <NuxtLink class="cta-button cta-button-secondary" :to="`/tournaments/${tournament.id}`">Открыть турнир</NuxtLink>
        </div>
      </article>
    </template>

    <div v-else class="empty-state-panel">
      <h2>Заявка не найдена или недоступна</h2>
      <p>Открывать заявку могут участники заявочного состава, капитан команды и администратор.</p>
      <NuxtLink class="cta-button cta-button-primary" to="/profile/tournaments">Мои турниры</NuxtLink>
    </div>
  </section>
</template>
