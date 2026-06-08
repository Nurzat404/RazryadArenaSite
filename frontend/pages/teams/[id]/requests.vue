<script setup lang="ts">
import { teamService, userService } from '~/services'
import type { TeamJoinRequest } from '~/types/domain'

definePageMeta({ layout: 'app', middleware: 'auth' })

const route = useRoute()
const teamId = String(route.params.id)
const [team, initialRequests, users] = await Promise.all([
  teamService.getById(teamId),
  teamService.listRequests(teamId),
  userService.list()
])

useHead({
  title: team ? `Заявки в ${team.name}` : 'Заявки в команду'
})

const requests = ref<TeamJoinRequest[]>(initialRequests)
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
  const updated = await teamService.updateRequestStatus(requestId, status)

  if (!updated) {
    return
  }

  requests.value = requests.value.map((request) => request.id === requestId ? updated : request)
}
</script>

<template>
  <section>
    <PageHead
      :title="team ? `Заявки: ${team.name}` : 'Команда не найдена'"
      subtitle="Игроки, которые хотят попасть в команду. Капитан принимает или отклоняет заявку."
    />

    <div v-if="team && requests.length" class="profile-grid">
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

    <div v-else-if="team" class="empty-state-panel">
      <h2>Заявок пока нет</h2>
      <p>Когда игроки отправят заявку или перейдут по invite-ссылке в режиме заявки, они появятся здесь.</p>
      <div class="empty-state-panel__actions">
        <NuxtLink class="cta-button cta-button-primary" :to="`/teams/${team.id}/invite`">Открыть invite</NuxtLink>
        <NuxtLink class="cta-button cta-button-secondary" :to="`/teams/${team.id}`">К команде</NuxtLink>
      </div>
    </div>

    <div v-else class="empty-state-panel">
      <h2>Команда не найдена</h2>
      <NuxtLink class="cta-button cta-button-primary" to="/teams">К списку команд</NuxtLink>
    </div>
  </section>
</template>
