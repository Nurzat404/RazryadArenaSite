<script setup lang="ts">
import { applicationService, ratingService, statsService, teamService, tournamentService } from '~/services'
import type { SportKey } from '~/types/domain'

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

useHead({
  title: 'Профиль | РазрядАрена',
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
const userTeams = currentUser ? await teamService.listByUser(currentUser.id) : []
const teamIds = userTeams.map((team) => team.id)
const applications = (
  await Promise.all(teamIds.map((teamId) => applicationService.list({ teamId })))
).flat()
const tournaments = await tournamentService.list()
const tournamentById = new Map(tournaments.map((tournament) => [tournament.id, tournament]))
const stats = currentUser ? await statsService.list({ userId: currentUser.id }) : []
const playerRatings = currentUser
  ? (await Promise.all(currentUser.favoriteSports.map((sport) => ratingService.leaderboard({
      sport,
      entityType: 'player',
      ratingScope: 'overall'
    })))).flat().filter((row) => row.entityId === currentUser.id)
  : []

const approvedApplications = applications.filter((application) => application.status === 'approved')
const pendingApplications = applications.filter((application) => application.status === 'pending')
const now = new Date()
const nextTournament = applications
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
  <section>
    <PageHead
      title="Профиль"
      subtitle="Ваши данные, команды, заявки и быстрые переходы к тому, что обычно ищут перед матчем."
    />

    <div class="profile-overview">
      <article class="profile-card profile-card--wide">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">{{ auth.user?.role === 'admin' ? 'Админ' : 'Игрок' }}</span>
            <h2>{{ auth.user?.name }}</h2>
          </div>
          <StatusBadge
            :status="auth.user?.emailVerified ? 'approved' : 'pending'"
            :label="auth.user?.emailVerified ? 'Почта подтверждена' : 'Почту подтвердим позже'"
          />
        </div>

        <dl class="profile-card__meta">
          <div>
            <dt>Email</dt>
            <dd>{{ auth.user?.email }}</dd>
          </div>
          <div>
            <dt>Город</dt>
            <dd>{{ auth.user?.city || 'Не указан' }}</dd>
          </div>
          <div>
            <dt>Возраст</dt>
            <dd>{{ auth.user?.age ? `${auth.user.age} лет` : 'Не указан' }}</dd>
          </div>
        </dl>

        <p class="profile-card__note">
          Любимые виды спорта:
          <strong v-if="auth.user?.favoriteSports.length">
            {{ auth.user.favoriteSports.map((sport) => sportLabels[sport]).join(', ') }}
          </strong>
          <span v-else>пока не выбраны</span>.
          Steam profile: {{ auth.user?.steamId || 'не указан' }}.
        </p>

        <div class="profile-card__actions">
          <NuxtLink class="cta-button cta-button-primary" to="/profile/edit">Редактировать профиль</NuxtLink>
          <NuxtLink class="cta-button cta-button-secondary" to="/profile/matches">Мои матчи</NuxtLink>
        </div>
      </article>

      <div class="profile-summary-grid">
        <article class="profile-summary-card">
          <span>{{ userTeams.length }}</span>
          <p>Команд</p>
          <NuxtLink to="/profile/teams">Открыть</NuxtLink>
        </article>
        <article class="profile-summary-card">
          <span>{{ approvedApplications.length }}</span>
          <p>Допущенных заявок</p>
          <NuxtLink to="/profile/tournaments">Открыть</NuxtLink>
        </article>
        <article class="profile-summary-card">
          <span>{{ pendingApplications.length }}</span>
          <p>Заявок на проверке</p>
          <NuxtLink to="/profile/tournaments">Открыть</NuxtLink>
        </article>
        <article class="profile-summary-card">
          <span>{{ stats.reduce((sum, item) => sum + item.matchesPlayed, 0) }}</span>
          <p>Матчей в статистике</p>
          <NuxtLink to="/profile/stats">Открыть</NuxtLink>
        </article>
      </div>
    </div>

    <div class="profile-grid mt-3">
      <article class="profile-card">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">Ближайшее</span>
            <h2>{{ nextTournament?.name || 'Турниров по заявкам пока нет' }}</h2>
          </div>
        </div>
        <p class="profile-card__note">
          <template v-if="nextTournament">
            Старт: {{ formatDate(nextTournament.eventStartDate) }}. Команда уже будет видна в разделе турниров.
          </template>
          <template v-else>
            Когда команда подаст заявку, здесь появится ближайший турнир.
          </template>
        </p>
        <div class="profile-card__actions">
          <NuxtLink class="cta-button cta-button-primary" to="/tournaments">Смотреть турниры</NuxtLink>
        </div>
      </article>

      <article class="profile-card">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">Рейтинг</span>
            <h2>{{ playerRatings[0]?.points ?? 'Пока нет' }}</h2>
          </div>
          <strong v-if="playerRatings[0]">#{{ playerRatings[0].position }}</strong>
        </div>
        <p class="profile-card__note">
          <template v-if="playerRatings.length">
            Лучший текущий рейтинг: {{ sportLabels[playerRatings[0].sport] }}.
          </template>
          <template v-else>
            Рейтинг появится после матчей и турниров.
          </template>
        </p>
        <div class="profile-card__actions">
          <NuxtLink class="cta-button cta-button-secondary" to="/ratings">Посмотреть рейтинг</NuxtLink>
        </div>
      </article>
    </div>
  </section>
</template>
