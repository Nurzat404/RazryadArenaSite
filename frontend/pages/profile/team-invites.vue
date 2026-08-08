<script setup lang="ts">
import { teamService, userService } from '~/services'
import type { TeamAccountInvite } from '~/types/domain'

definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Приглашения в команды' })

const auth = useAuthStore()
if (!auth.initialized) await auth.loadCurrentUser()

const [initialInvites, teams, users] = await Promise.all([
  auth.user ? teamService.listAccountInvites({ userId: auth.user.id, status: 'pending' }) : [],
  teamService.list(),
  userService.list()
])
const invites = ref<TeamAccountInvite[]>(initialInvites)
const teamById = new Map(teams.map((team) => [team.id, team]))
const userById = new Map(users.map((user) => [user.id, user]))
const sportLabels = { cs2: 'CS2', football: 'Футбол', basketball: 'Баскетбол', volleyball: 'Волейбол' } as const
const actionError = ref('')
const pendingId = ref('')

const respond = async (invite: TeamAccountInvite, status: 'accepted' | 'rejected') => {
  if (!auth.user) return
  actionError.value = ''
  pendingId.value = invite.id
  try {
    await teamService.respondToAccountInvite(invite.id, auth.user.id, status)
    invites.value = invites.value.filter((item) => item.id !== invite.id)
    if (status === 'accepted') await navigateTo(`/teams/${invite.teamId}`)
  } catch (error) {
    const reason = error instanceof Error ? error.message : ''
    actionError.value = reason === 'team_full'
      ? 'В команде уже нет свободных мест.'
      : 'Не получилось обработать приглашение. Обновите страницу и попробуйте ещё раз.'
  } finally {
    pendingId.value = ''
  }
}
</script>

<template>
  <section class="workspace-page workspace-page--profile">
    <PageHead title="Приглашения в команды" subtitle="Команды, которые ждут вашего ответа." />
    <p v-if="actionError" class="form-error">{{ actionError }}</p>

    <div v-if="invites.length" class="profile-grid">
      <article v-for="invite in invites" :key="invite.id" class="profile-card">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">Приглашение</span>
            <h2>{{ teamById.get(invite.teamId)?.name ?? 'Команда не найдена' }}</h2>
          </div>
        </div>
        <dl class="profile-card__meta">
          <div><dt>Спорт</dt><dd>{{ sportLabels[teamById.get(invite.teamId)?.sport ?? 'cs2'] }}</dd></div>
          <div><dt>Капитан</dt><dd>{{ userById.get(teamById.get(invite.teamId)?.captainId ?? '')?.name ?? 'Не найден' }}</dd></div>
          <div><dt>Город</dt><dd>{{ teamById.get(invite.teamId)?.city ?? 'Не указан' }}</dd></div>
        </dl>
        <div class="profile-card__actions">
          <button class="cta-button cta-button-primary" type="button" :disabled="pendingId === invite.id" @click="respond(invite, 'accepted')">Принять</button>
          <button class="cta-button cta-button-secondary" type="button" :disabled="pendingId === invite.id" @click="respond(invite, 'rejected')">Отклонить</button>
        </div>
      </article>
    </div>

    <div v-else class="empty-state-panel">
      <h2>Новых приглашений нет</h2>
      <p>Когда капитан пригласит вас в команду, приглашение появится здесь.</p>
      <NuxtLink class="cta-button cta-button-primary" to="/teams">Смотреть команды</NuxtLink>
    </div>
  </section>
</template>
