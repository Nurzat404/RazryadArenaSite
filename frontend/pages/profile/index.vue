<script setup lang="ts">
import { applicationService, ratingService, teamService, tournamentService } from '~/services'
import type { SportKey } from '~/types/domain'

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

useHead({
  title: 'Профиль',
  meta: [
    {
      name: 'description',
      content: 'Личный кабинет игрока РазрядАрены: профиль, команды, турниры, матчи, статистика и приглашения.'
    }
  ]
})

const auth = useAuthStore()
await auth.loadCurrentUser()

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const currentUser = auth.user
const userInitials = currentUser?.name
  .split(/\s+/)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase() ?? 'РА'
const userTeams = currentUser ? await teamService.listByUser(currentUser.id) : []
const teamIds = userTeams.map((team) => team.id)
const applications = (
  await Promise.all(teamIds.map((teamId) => applicationService.list({ teamId })))
).flat()
const tournaments = await tournamentService.list()
const rosters = await applicationService.listRosters()
const tournamentById = new Map(tournaments.map((tournament) => [tournament.id, tournament]))
const playerRatings = currentUser
  ? (await Promise.all(currentUser.favoriteSports.map((sport) => ratingService.leaderboard({
      sport,
      entityType: 'player',
      ratingScope: 'overall'
    })))).flat().filter((row) => row.entityId === currentUser.id)
  : []

const now = new Date()
const nextTournament = applications
  .filter((application) => application.status === 'approved')
  .filter((application) => currentUser && rosters.some((roster) => (
    roster.tournamentId === application.tournamentId
    && roster.teamId === application.teamId
    && roster.playerIds.includes(currentUser.id)
  )))
  .map((application) => tournamentById.get(application.tournamentId))
  .filter(Boolean)
  .filter((tournament) => new Date(tournament!.eventStartDate) >= now)
  .sort((a, b) => a!.eventStartDate.localeCompare(b!.eventStartDate))[0]

const formatDate = (value?: string) => value
  ? new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(value))
  : 'нет даты'
</script>

<template>
  <section class="workspace-page workspace-page--profile">
    <PageHead
      title="Профиль"
      subtitle="Данные аккаунта, ближайший турнир и рейтинг."
    />

    <section class="profile-identity" aria-labelledby="profile-name">
      <div class="profile-identity__avatar" aria-hidden="true">{{ userInitials }}</div>
      <div class="profile-identity__main">
        <div class="profile-identity__title">
          <div>
            <span>{{ auth.user?.role === 'admin' ? 'Админ' : 'Игрок' }}</span>
            <h2 id="profile-name">{{ auth.user?.name }}</h2>
          </div>
          <StatusBadge
            :status="auth.user?.emailVerified ? 'approved' : 'pending'"
            :label="auth.user?.emailVerified ? 'Почта подтверждена' : 'Почта не подтверждена'"
          />
        </div>

        <dl class="profile-identity__facts">
          <div><dt>Email</dt><dd>{{ auth.user?.email }}</dd></div>
          <div><dt>Город</dt><dd>{{ auth.user?.city || 'Не указан' }}</dd></div>
          <div><dt>Возраст</dt><dd>{{ auth.user?.age ? `${auth.user.age} лет` : 'Не указан' }}</dd></div>
          <div>
            <dt>Спорт</dt>
            <dd>{{ auth.user?.favoriteSports.length ? auth.user.favoriteSports.map((sport) => sportLabels[sport]).join(', ') : 'Не выбран' }}</dd>
          </div>
        </dl>

        <div v-if="auth.user?.steamProfileUrl" class="profile-identity__external">
          <span>Steam</span>
          <a class="site-footer-link" :href="auth.user.steamProfileUrl" target="_blank" rel="noopener noreferrer">Открыть профиль</a>
        </div>

        <div class="profile-identity__actions">
          <NuxtLink class="cta-button cta-button-primary" to="/profile/edit">Редактировать</NuxtLink>
          <NuxtLink v-if="currentUser" class="cta-button cta-button-secondary" :to="`/players/${currentUser.id}`">Публичный профиль</NuxtLink>
        </div>
      </div>
    </section>

    <div class="profile-focus">
      <section class="profile-next-event">
        <p>Ближайший турнир</p>
        <h2>{{ nextTournament?.name || 'Заявок пока нет' }}</h2>
        <strong v-if="nextTournament">{{ formatDate(nextTournament.eventStartDate) }}</strong>
        <span v-else>Откройте турниры и выберите подходящий.</span>
        <NuxtLink to="/tournaments">Открыть турниры</NuxtLink>
      </section>

      <aside class="profile-rating" aria-label="Лучший рейтинг">
        <span>Рейтинг</span>
        <strong>{{ playerRatings[0]?.points ?? '—' }}</strong>
        <p v-if="playerRatings[0]">#{{ playerRatings[0].position }} · {{ sportLabels[playerRatings[0].sport] }}</p>
        <p v-else>Появится после первых матчей.</p>
        <NuxtLink to="/ratings">Открыть рейтинг</NuxtLink>
      </aside>
    </div>
  </section>
</template>
