<script setup lang="ts">
import { teamService, userService } from '~/services'
import type { TeamMember, TeamMemberBlock, TeamMemberRole } from '~/types/domain'

definePageMeta({ layout: 'app', middleware: 'auth' })

const route = useRoute()
const auth = useAuthStore()

if (!auth.initialized) {
  await auth.loadCurrentUser()
}

const teamId = String(route.params.id)
const [team, initialMembers, users, initialBlocks] = await Promise.all([
  teamService.getById(teamId),
  teamService.listMembers(teamId),
  userService.list(),
  teamService.listBlocks(teamId)
])

useHead({ title: team ? `Состав ${team.name}` : 'Состав команды' })

const members = ref<TeamMember[]>(initialMembers)
const blocks = ref<TeamMemberBlock[]>(initialBlocks)
const playerEmail = ref('')
const actionError = ref('')
const actionMessage = ref('')
const actionPending = ref(false)
const canManage = computed(() => Boolean(
  team
  && auth.user
  && (team.captainId === auth.user.id || auth.user.role === 'admin')
))
const isMember = computed(() => members.value.some((member) => member.userId === auth.user?.id))

const roleLabels: Record<TeamMemberRole, string> = {
  captain: 'Капитан',
  member: 'Игрок',
  substitute: 'Запасной'
}

const userById = new Map(users.map((user) => [user.id, user]))
const formatDate = (value: string) => new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}).format(new Date(value))

const refresh = async () => {
  members.value = await teamService.listMembers(teamId)
  blocks.value = await teamService.listBlocks(teamId)
}

const runAction = async (action: () => Promise<unknown>, success: string) => {
  actionError.value = ''
  actionMessage.value = ''
  try {
    await action()
    await refresh()
    actionMessage.value = success
  } catch (error) {
    const reason = error instanceof Error ? error.message : ''
    actionError.value = reason === 'team_full'
      ? 'В составе нет свободных мест.'
      : reason === 'blocked'
        ? 'Этот игрок заблокирован для команды.'
        : 'Не получилось выполнить действие.'
  }
}

const addPlayer = async () => {
  const user = users.find((item) => item.email.toLowerCase() === playerEmail.value.trim().toLowerCase())
  if (!user) {
    actionError.value = 'Игрок с таким email не найден.'
    return
  }
  actionPending.value = true
  await runAction(
    () => auth.isAdmin
      ? teamService.addMember(teamId, user.id)
      : teamService.inviteAccount(teamId, user.id, auth.user!.id),
    auth.isAdmin ? `${user.name} добавлен в команду.` : `Приглашение отправлено игроку ${user.name}.`
  )
  actionPending.value = false
  playerEmail.value = ''
}

const removePlayer = async (userId: string) => {
  await runAction(() => teamService.removeMember(teamId, userId), 'Игрок удалён из состава.')
}

const blockPlayer = async (userId: string) => {
  if (!auth.user) return
  await runAction(() => teamService.blockMember(teamId, userId, auth.user!.id), 'Игрок удалён и больше не сможет подать заявку.')
}

const unblockPlayer = async (userId: string) => {
  await runAction(() => teamService.unblockMember(teamId, userId), 'Блокировка снята.')
}

const transferCaptain = async (userId: string) => {
  await teamService.transferCaptain(teamId, userId)
  await navigateTo(`/teams/${teamId}`)
}

const leaveTeam = async () => {
  if (!auth.user || !team || team.captainId === auth.user.id) return
  await teamService.leave(team.id, auth.user.id)
  await navigateTo('/profile/teams')
}

const deleteTeam = async () => {
  if (!team || !canManage.value) return
  if (import.meta.client && !window.confirm('Удалить команду? Вернуть её не получится.')) return
  await teamService.delete(team.id)
  await navigateTo('/teams')
}
</script>

<template>
  <section class="workspace-page workspace-page--team">
    <PageHead
      :title="team ? `Состав: ${team.name}` : 'Команда не найдена'"
      subtitle="Игроки команды, капитан и свободные места."
    />

    <template v-if="team">
      <TeamNav :team-id="team.id" active="members" :can-manage="canManage" />

      <p v-if="actionMessage" class="form-success">{{ actionMessage }}</p>
      <p v-if="actionError" class="form-error">{{ actionError }}</p>

      <div class="profile-grid">
        <article class="profile-card profile-card--wide">
          <div class="profile-card__head">
            <div>
              <span class="profile-card__badge">Состав</span>
              <h2>{{ members.length }}/{{ team.maxMembers }} игроков</h2>
            </div>
            <strong>{{ Math.max(team.maxMembers - members.length, 0) }}</strong>
          </div>

          <p class="profile-card__note">Свободных мест: {{ Math.max(team.maxMembers - members.length, 0) }}.</p>

          <div class="team-member-list">
            <div v-for="member in members" :key="member.id" class="team-member-row">
              <div>
                <strong>{{ userById.get(member.userId)?.name ?? 'Игрок не найден' }}</strong>
                <span>{{ roleLabels[member.role] }} · с {{ formatDate(member.joinedAt) }}</span>
              </div>
              <div class="team-row-actions">
                <small>{{ userById.get(member.userId)?.city ?? 'Город не указан' }}</small>
                <template v-if="canManage && member.userId !== team.captainId">
                  <button class="teams-filter-button" type="button" @click="transferCaptain(member.userId)">Сделать капитаном</button>
                  <button class="teams-filter-button" type="button" @click="removePlayer(member.userId)">Удалить</button>
                  <button class="teams-filter-button team-action-danger" type="button" @click="blockPlayer(member.userId)">Заблокировать</button>
                </template>
              </div>
            </div>
          </div>
        </article>

        <article v-if="canManage" class="profile-card">
          <div class="profile-card__head">
            <div>
              <span class="profile-card__badge">{{ auth.isAdmin ? 'Добавить игрока' : 'Пригласить игрока' }}</span>
              <h2>По email аккаунта</h2>
            </div>
          </div>
          <form class="team-request-form" @submit.prevent="addPlayer">
            <label class="form-label" for="memberEmail">Email игрока</label>
            <input id="memberEmail" v-model="playerEmail" class="form-control" type="email" placeholder="player@example.com" required>
            <button class="cta-button cta-button-primary" type="submit" :disabled="actionPending">
              {{ actionPending ? 'Отправляем...' : auth.isAdmin ? 'Добавить в состав' : 'Отправить приглашение' }}
            </button>
          </form>
          <NuxtLink class="cta-button cta-button-secondary" :to="`/teams/${team.id}/requests`">Открыть заявки</NuxtLink>
        </article>

        <article v-if="canManage && blocks.length" class="profile-card">
          <div class="profile-card__head">
            <div>
              <span class="profile-card__badge">Блокировки</span>
              <h2>{{ blocks.length }} игроков</h2>
            </div>
          </div>
          <div class="team-list-stack">
            <div v-for="block in blocks" :key="block.id" class="team-list-row">
              <div>
                <strong>{{ userById.get(block.userId)?.name ?? 'Игрок не найден' }}</strong>
                <span>{{ block.reason || 'Не сможет вступить или отправить заявку' }}</span>
              </div>
              <button class="teams-filter-button" type="button" @click="unblockPlayer(block.userId)">Разблокировать</button>
            </div>
          </div>
        </article>

        <article v-if="isMember || canManage" class="profile-card">
          <div class="profile-card__head">
            <div>
              <span class="profile-card__badge">Команда</span>
              <h2>Выход и удаление</h2>
            </div>
          </div>
          <p v-if="auth.user?.id === team.captainId" class="profile-card__note">
            Чтобы выйти, сначала передайте капитанство другому игроку. Если команда больше не нужна, её можно удалить.
          </p>
          <div class="profile-card__actions">
            <button v-if="isMember && auth.user?.id !== team.captainId" class="cta-button cta-button-secondary" type="button" @click="leaveTeam">Выйти из команды</button>
            <button v-if="canManage" class="cta-button cta-button-secondary team-action-danger" type="button" @click="deleteTeam">Удалить команду</button>
          </div>
        </article>
      </div>
    </template>

    <div v-else class="empty-state-panel">
      <h2>Команда не найдена</h2>
      <NuxtLink class="cta-button cta-button-primary" to="/teams">К списку команд</NuxtLink>
    </div>
  </section>
</template>
