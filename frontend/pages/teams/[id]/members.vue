<script setup lang="ts">
import { teamService, userService } from '~/services'
import type { TeamMemberRole } from '~/types/domain'

definePageMeta({ layout: 'app', middleware: 'auth' })

const route = useRoute()
const teamId = String(route.params.id)
const [team, members, users] = await Promise.all([
  teamService.getById(teamId),
  teamService.listMembers(teamId),
  userService.list()
])

useHead({
  title: team ? `Состав ${team.name}` : 'Состав команды'
})

const roleLabels: Record<TeamMemberRole, string> = {
  captain: 'Капитан',
  member: 'Игрок',
  substitute: 'Запасной'
}

const userById = new Map(users.map((user) => [user.id, user]))

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(value))
</script>

<template>
  <section>
    <PageHead
      :title="team ? `Состав: ${team.name}` : 'Команда не найдена'"
      subtitle="Игроки команды, капитан и места в составе."
    />

    <div v-if="team" class="profile-grid">
      <article class="profile-card profile-card--wide">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">Состав</span>
            <h2>{{ members.length }}/{{ team.maxMembers }} игроков</h2>
          </div>
          <strong>{{ Math.max(team.maxMembers - members.length, 0) }}</strong>
        </div>

        <p class="profile-card__note">
          Свободных мест: {{ Math.max(team.maxMembers - members.length, 0) }}.
          Если мест нет, капитан может увеличить лимит в настройках команды.
        </p>

        <div class="team-member-list">
          <div v-for="member in members" :key="member.id" class="team-member-row">
            <div>
              <strong>{{ userById.get(member.userId)?.name ?? 'Игрок не найден' }}</strong>
              <span>{{ roleLabels[member.role] }} · с {{ formatDate(member.joinedAt) }}</span>
            </div>
            <small>{{ userById.get(member.userId)?.city ?? 'Город не указан' }}</small>
          </div>
        </div>
      </article>

      <article class="profile-card">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">Действия</span>
            <h2>Управление составом</h2>
          </div>
        </div>
        <p class="profile-card__note">
          В frontend-моке игроки не добавляются навсегда. После backend здесь будут добавление по username, удаление игрока и смена капитана.
        </p>
        <div class="profile-card__actions">
          <NuxtLink class="cta-button cta-button-primary" :to="`/teams/${team.id}/requests`">Заявки в команду</NuxtLink>
          <NuxtLink class="cta-button cta-button-secondary" :to="`/teams/${team.id}/edit`">Настройки</NuxtLink>
        </div>
      </article>
    </div>

    <div v-else class="empty-state-panel">
      <h2>Команда не найдена</h2>
      <NuxtLink class="cta-button cta-button-primary" to="/teams">К списку команд</NuxtLink>
    </div>
  </section>
</template>
