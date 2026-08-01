<script setup lang="ts">
import { teamService, userService } from '~/services'
import type { TeamJoinRequest } from '~/types/domain'

definePageMeta({ layout: 'app', middleware: 'auth' })

const route = useRoute()
const teamId = String(route.params.id)
const auth = useAuthStore()

if (!auth.initialized) {
  await auth.loadCurrentUser()
}

const [team, initialRequests, users] = await Promise.all([
  teamService.getById(teamId),
  teamService.listRequests(teamId),
  userService.list()
])

useHead({
  title: team ? `Заявки в ${team.name}` : 'Заявки в команду'
})

const requests = ref<TeamJoinRequest[]>(initialRequests)
const canManage = Boolean(team && auth.user && team.captainId === auth.user.id)
const actionError = ref('')
const userById = new Map(users.map((user) => [user.id, user]))

const statusLabels = {
  pending: 'Ждёт ответа',
  accepted: 'Принята',
  rejected: 'Отклонена'
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))

const setStatus = async (requestId: string, status: TeamJoinRequest['status']) => {
  actionError.value = ''
  if (!canManage) return

  let updated
  try {
    updated = await teamService.updateRequestStatus(requestId, status)
  } catch (error) {
    actionError.value = error instanceof Error && error.message === 'team_full'
      ? 'В составе нет свободных мест. Сначала увеличьте лимит или освободите место.'
      : 'Не получилось обработать заявку.'
    return
  }

  if (!updated) {
    return
  }

  requests.value = requests.value.map((request) => request.id === requestId ? updated : request)
}
</script>

<template>
  <section class="workspace-page workspace-page--team">
    <PageHead
      :title="team ? `Заявки: ${team.name}` : 'Команда не найдена'"
      subtitle="Игроки, которые хотят попасть в команду. Капитан принимает или отклоняет заявку."
    />

    <p v-if="actionError" class="form-error">{{ actionError }}</p>

    <div v-if="team && canManage && requests.length" class="profile-grid">
      <article v-for="request in requests" :key="request.id" class="profile-card">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">{{ statusLabels[request.status] }}</span>
            <h2>{{ userById.get(request.userId)?.name ?? 'Игрок не найден' }}</h2>
          </div>
          <StatusBadge :status="request.status === 'accepted' ? 'approved' : request.status === 'rejected' ? 'rejected' : 'pending'" :label="statusLabels[request.status]" />
        </div>

        <dl class="profile-card__meta">
          <div>
            <dt>Город</dt>
            <dd>{{ userById.get(request.userId)?.city ?? 'Не указан' }}</dd>
          </div>
          <div>
            <dt>Возраст</dt>
            <dd>{{ userById.get(request.userId)?.age ?? 'Не указан' }}</dd>
          </div>
          <div>
            <dt>Когда</dt>
            <dd>{{ formatDate(request.createdAt) }}</dd>
          </div>
        </dl>

        <p class="profile-card__note">{{ request.message || 'Игрок не оставил комментарий.' }}</p>

        <div class="profile-card__actions">
          <button class="cta-button cta-button-primary" type="button" :disabled="request.status !== 'pending'" @click="setStatus(request.id, 'accepted')">
            Принять
          </button>
          <button class="cta-button cta-button-secondary" type="button" :disabled="request.status !== 'pending'" @click="setStatus(request.id, 'rejected')">
            Отклонить
          </button>
        </div>
      </article>
    </div>

    <div v-else-if="team && canManage" class="empty-state-panel">
      <h2>Заявок пока нет</h2>
      <p>Когда игрок отправит заявку напрямую или по ссылке, она появится здесь.</p>
      <div class="empty-state-panel__actions">
        <NuxtLink class="cta-button cta-button-primary" :to="`/teams/${team.id}/invite`">Открыть ссылку для вступления</NuxtLink>
        <NuxtLink class="cta-button cta-button-secondary" :to="`/teams/${team.id}`">К команде</NuxtLink>
      </div>
    </div>

    <div v-else-if="team" class="empty-state-panel">
      <h2>Нет доступа к заявкам</h2>
      <p>Заявки видит капитан команды.</p>
      <NuxtLink class="cta-button cta-button-primary" :to="`/teams/${team.id}`">Открыть команду</NuxtLink>
    </div>

    <div v-else class="empty-state-panel">
      <h2>Команда не найдена</h2>
      <NuxtLink class="cta-button cta-button-primary" to="/teams">К списку команд</NuxtLink>
    </div>
  </section>
</template>
