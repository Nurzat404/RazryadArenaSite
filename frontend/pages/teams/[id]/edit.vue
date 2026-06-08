<script setup lang="ts">
import { teamService } from '~/services'
import type { TeamInviteJoinMode } from '~/types/domain'

definePageMeta({ layout: 'app', middleware: 'auth' })

const route = useRoute()
const teamId = String(route.params.id)
const team = await teamService.getById(teamId)

useHead({
  title: team ? `Настройки команды ${team.name}` : 'Команда не найдена'
})

const form = reactive({
  name: team?.name ?? '',
  city: team?.city ?? '',
  maxMembers: team?.maxMembers ?? 5,
  isOpenForRequests: team?.isOpenForRequests ?? true,
  notifyOnRequests: team?.notifyOnRequests ?? true,
  inviteEnabled: team?.inviteEnabled ?? true,
  inviteJoinMode: (team?.inviteJoinMode ?? 'request') as TeamInviteJoinMode
})

const saved = ref(false)
const errorMessage = ref('')

const submitSettings = async () => {
  saved.value = false
  errorMessage.value = ''

  if (!team) {
    errorMessage.value = 'Команда не найдена.'
    return
  }

  if (!form.name.trim()) {
    errorMessage.value = 'Название команды не должно быть пустым.'
    return
  }

  if (form.maxMembers < team.memberIds.length) {
    errorMessage.value = `Лимит не может быть меньше текущего состава: ${team.memberIds.length}.`
    return
  }

  await teamService.update(team.id, {
    name: form.name.trim(),
    city: form.city.trim() || 'Онлайн',
    maxMembers: form.maxMembers,
    isOpenForRequests: form.isOpenForRequests,
    notifyOnRequests: form.notifyOnRequests,
    inviteEnabled: form.inviteEnabled,
    inviteJoinMode: form.inviteJoinMode
  })

  saved.value = true
}
</script>

<template>
  <section>
    <PageHead
      :title="team ? `Настройки: ${team.name}` : 'Команда не найдена'"
      subtitle="Название, город, лимит игроков, заявки и invite-ссылка команды."
    />

    <form v-if="team" class="form-panel profile-edit-form" @submit.prevent="submitSettings">
      <div class="form-section">
        <h2 class="form-section__title">Данные команды</h2>

        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label" for="teamName">Название</label>
            <input id="teamName" v-model="form.name" class="form-control" type="text" required>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="teamCity">Город</label>
            <input id="teamCity" v-model="form.city" class="form-control" type="text">
          </div>
          <div class="col-md-6">
            <label class="form-label" for="teamMaxMembers">Лимит игроков</label>
            <input id="teamMaxMembers" v-model.number="form.maxMembers" class="form-control" type="number" min="1" max="30">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2 class="form-section__title">Заявки и invite</h2>
        <div class="team-settings-grid">
          <label class="team-setting-switch">
            <input v-model="form.isOpenForRequests" type="checkbox">
            <span>Заявки в команду открыты</span>
          </label>
          <label class="team-setting-switch">
            <input v-model="form.notifyOnRequests" type="checkbox">
            <span>Уведомлять о новых заявках</span>
          </label>
          <label class="team-setting-switch">
            <input v-model="form.inviteEnabled" type="checkbox">
            <span>Invite-ссылка включена</span>
          </label>
          <label class="team-setting-switch">
            <input v-model="form.inviteJoinMode" type="radio" value="request">
            <span>Invite ведёт в заявку</span>
          </label>
          <label class="team-setting-switch">
            <input v-model="form.inviteJoinMode" type="radio" value="direct">
            <span>Invite сразу добавляет в команду</span>
          </label>
        </div>
      </div>

      <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
      <p v-if="saved" class="form-success">Настройки сохранены в мок-режиме.</p>

      <div class="profile-form-actions">
        <button class="cta-button cta-button-primary" type="submit">Сохранить настройки</button>
        <NuxtLink class="cta-button cta-button-secondary" :to="`/teams/${team.id}`">Вернуться к команде</NuxtLink>
      </div>
    </form>

    <div v-else class="empty-state-panel">
      <h2>Команда не найдена</h2>
      <NuxtLink class="cta-button cta-button-primary" to="/teams">К списку команд</NuxtLink>
    </div>
  </section>
</template>
