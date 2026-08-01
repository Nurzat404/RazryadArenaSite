<script setup lang="ts">
import { applicationService, teamService, tournamentService, userService } from '~/services'
import type { ApplicationStatus, SportKey } from '~/types/domain'

const route = useRoute()
const teamId = String(route.params.id)
const auth = useAuthStore()

if (!auth.initialized) {
  await auth.loadCurrentUser()
}

const [team, users, members, requests, applications, tournaments] = await Promise.all([
  teamService.getById(teamId),
  userService.list(),
  teamService.listMembers(teamId),
  teamService.listRequests(teamId),
  applicationService.list({ teamId }),
  tournamentService.list()
])

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const applicationStatusLabels: Record<ApplicationStatus, string> = {
  pending: 'На проверке',
  approved: 'Допущена',
  rejected: 'Отклонена',
  excluded: 'Исключена'
}

const userById = new Map(users.map((user) => [user.id, user]))
const tournamentById = new Map(tournaments.map((tournament) => [tournament.id, tournament]))
const currentRequests = ref(requests)
const pendingRequests = computed(() => currentRequests.value.filter((request) => request.status === 'pending'))
const captain = team ? userById.get(team.captainId) : null
const isMember = computed(() => Boolean(auth.user && members.some((member) => member.userId === auth.user?.id)))
const canManage = computed(() => Boolean(team && auth.user && team.captainId === auth.user.id))
const ownPendingRequest = computed(() => currentRequests.value.find((request) => request.userId === auth.user?.id && request.status === 'pending'))
const requestMessage = ref('')
const requestFeedback = ref('')
const requestError = ref('')

const submitRequest = async () => {
  if (!team || !auth.user) return
  requestError.value = ''
  requestFeedback.value = ''

  try {
    const request = await teamService.createRequest({
      teamId: team.id,
      userId: auth.user.id,
      message: requestMessage.value.trim() || undefined
    })
    currentRequests.value = [request, ...currentRequests.value]
    requestMessage.value = ''
    requestFeedback.value = 'Заявка отправлена капитану.'
  } catch (error) {
    const reason = error instanceof Error ? error.message : ''
    requestError.value = reason === 'blocked'
      ? 'Капитан ограничил вступление этого аккаунта.'
      : reason === 'requests_closed'
        ? 'Команда сейчас не принимает заявки.'
        : 'Заявка уже отправлена или вы уже состоите в команде.'
  }
}

const cancelRequest = async () => {
  if (!team || !auth.user) return
  if (await teamService.cancelRequest(team.id, auth.user.id)) {
    currentRequests.value = currentRequests.value.filter((request) => request.id !== ownPendingRequest.value?.id)
    requestFeedback.value = 'Заявка отменена.'
  }
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))

useHead({
  title: team ? `${team.name} — команда РазрядАрены` : 'Команда не найдена'
})
</script>

<template>
  <section class="section-padding workspace-page workspace-page--team-detail">
    <div class="container">
      <PageHead
        :title="team?.name ?? 'Команда не найдена'"
      />

      <div v-if="team" class="team-detail-layout">
        <article class="profile-card profile-card--wide">
          <div class="profile-card__head">
            <div>
              <span class="profile-card__badge">{{ sportLabels[team.sport] }}</span>
              <h2>О команде</h2>
            </div>
            <span class="profile-card__rating">Рейтинг <strong>{{ team.rating }}</strong></span>
          </div>

          <dl class="profile-card__meta">
            <div>
              <dt>Капитан</dt>
              <dd>{{ captain?.name ?? 'Не найден' }}</dd>
            </div>
            <div>
              <dt>Город</dt>
              <dd>{{ team.city }}</dd>
            </div>
            <div>
              <dt>Состав</dt>
              <dd>{{ team.memberIds.length }}/{{ team.maxMembers }}</dd>
            </div>
          </dl>

          <div v-if="canManage" class="profile-card__actions team-management-actions">
            <NuxtLink class="cta-button cta-button-primary" :to="`/teams/${team.id}/members`">Состав</NuxtLink>
            <NuxtLink class="cta-button cta-button-secondary" :to="`/teams/${team.id}/requests`">Заявки</NuxtLink>
            <NuxtLink class="cta-button cta-button-secondary" :to="`/teams/${team.id}/invite`">Пригласить</NuxtLink>
            <NuxtLink class="cta-button cta-button-secondary" :to="`/teams/${team.id}/edit`">Настройки</NuxtLink>
          </div>
        </article>

        <aside class="team-side-panel">
          <div>
            <span>{{ canManage ? `Заявки, новых: ${pendingRequests.length}` : 'Заявки в команду' }}</span>
            <strong>{{ team.isOpenForRequests ? 'Открыты' : 'Закрыты' }}</strong>
          </div>
          <div v-if="canManage">
            <span>Вступление</span>
            <strong>{{ !team.inviteEnabled ? 'Закрыто' : team.inviteJoinMode === 'direct' ? 'По ссылке' : 'Через заявку' }}</strong>
          </div>
          <div>
            <span>Свободных мест</span>
            <strong>{{ Math.max(team.maxMembers - members.length, 0) }}</strong>
          </div>
        </aside>
      </div>

      <article v-if="team && !isMember && !canManage" class="surface-panel p-4 mt-3">
        <template v-if="auth.isAuthenticated">
          <h2 class="h4 mb-2">Заявка в команду</h2>
          <template v-if="ownPendingRequest">
            <p class="text-muted-strong">Заявка уже у капитана. Можно дождаться ответа или отменить её.</p>
            <button class="cta-button cta-button-secondary" type="button" @click="cancelRequest">Отменить заявку</button>
          </template>
          <form v-else-if="team.isOpenForRequests" class="team-request-form" @submit.prevent="submitRequest">
            <label class="form-label" for="joinMessage">Коротко о себе <span class="text-muted-strong">(по желанию)</span></label>
            <textarea id="joinMessage" v-model="requestMessage" class="form-control" rows="3" placeholder="Когда играете и на какой позиции"></textarea>
            <button class="cta-button cta-button-primary" type="submit">Подать заявку</button>
          </form>
          <p v-else class="text-muted-strong mb-0">Команда сейчас не принимает заявки.</p>
          <p v-if="requestFeedback" class="form-success">{{ requestFeedback }}</p>
          <p v-if="requestError" class="form-error">{{ requestError }}</p>
        </template>
        <template v-else>
          <h2 class="h4 mb-2">Хотите вступить?</h2>
          <p class="text-muted-strong">Войдите в аккаунт, чтобы отправить заявку капитану.</p>
          <NuxtLink class="cta-button cta-button-primary" to="/login">Войти</NuxtLink>
        </template>
      </article>

      <div v-if="team" class="profile-grid team-detail-sections mt-3">
        <article class="profile-card">
          <div class="profile-card__head">
            <div>
              <span class="profile-card__badge">Состав</span>
              <h2>{{ members.length }} игроков</h2>
            </div>
          </div>
          <div class="team-member-list">
            <div v-for="member in members" :key="member.id" class="team-member-row">
              <div>
                <strong>{{ userById.get(member.userId)?.name ?? 'Игрок не найден' }}</strong>
                <span>{{ member.role === 'captain' ? 'Капитан' : 'Игрок' }}</span>
              </div>
              <small>{{ formatDate(member.joinedAt) }}</small>
            </div>
          </div>
        </article>

        <article v-if="canManage" class="profile-card">
          <div class="profile-card__head">
            <div>
              <span class="profile-card__badge">Турниры</span>
              <h2>{{ applications.length ? 'Заявки команды' : 'Пока нет заявок' }}</h2>
            </div>
          </div>
          <div v-if="applications.length" class="team-list-stack">
            <div v-for="application in applications" :key="application.id" class="team-list-row">
              <div>
                <strong>{{ tournamentById.get(application.tournamentId)?.name ?? 'Турнир не найден' }}</strong>
                <span>{{ application.comment || application.rejectReason || 'Комментариев нет' }}</span>
              </div>
              <StatusBadge :status="application.status" :label="applicationStatusLabels[application.status]" />
            </div>
          </div>
          <p v-else class="profile-card__note">
            Команда еще не подавала заявки. Откройте турниры и выберите подходящий.
          </p>
        </article>

      </div>

      <div v-else class="empty-state-panel">
        <h2>Команда не найдена</h2>
        <p>Возможно, команда была удалена или ссылка устарела.</p>
        <div class="empty-state-panel__actions">
          <NuxtLink class="cta-button cta-button-primary" to="/teams">Вернуться к командам</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
