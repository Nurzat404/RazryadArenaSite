<script setup lang="ts">
import { teamService } from '~/services'
import type { SportKey, TeamInviteJoinMode } from '~/types/domain'

definePageMeta({ layout: 'app', middleware: 'auth' })

useHead({
  title: 'Создать команду | РазрядАрена',
  meta: [
    {
      name: 'description',
      content: 'Создание команды в РазрядАрене: спорт, город, лимит состава и настройки заявок.'
    }
  ]
})

const auth = useAuthStore()

if (!auth.initialized) {
  await auth.loadCurrentUser()
}

const sportOptions: Array<{ key: SportKey, label: string }> = [
  { key: 'cs2', label: 'CS2' },
  { key: 'football', label: 'Футбол' },
  { key: 'basketball', label: 'Баскетбол' },
  { key: 'volleyball', label: 'Волейбол' }
]

const form = reactive({
  name: '',
  sport: 'cs2' as SportKey,
  city: auth.user?.city ?? '',
  maxMembers: 5,
  isOpenForRequests: true,
  notifyOnRequests: true,
  inviteJoinMode: 'request' as TeamInviteJoinMode
})

const createdTeamId = ref('')
const errorMessage = ref('')
const saving = ref(false)

const submitTeam = async () => {
  errorMessage.value = ''
  createdTeamId.value = ''

  if (!auth.user) {
    errorMessage.value = 'Войдите в аккаунт, чтобы создать команду.'
    return
  }

  if (!form.name.trim()) {
    errorMessage.value = 'Укажите название команды.'
    return
  }

  if (form.maxMembers < 1 || form.maxMembers > 30) {
    errorMessage.value = 'Лимит состава должен быть от 1 до 30 игроков.'
    return
  }

  saving.value = true

  try {
    const team = await teamService.create({
      name: form.name.trim(),
      sport: form.sport,
      city: form.city.trim() || 'Онлайн',
      captainId: auth.user.id,
      maxMembers: form.maxMembers,
      isOpenForRequests: form.isOpenForRequests,
      notifyOnRequests: form.notifyOnRequests,
      inviteJoinMode: form.inviteJoinMode,
      inviteEnabled: true
    })
    createdTeamId.value = team.id
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section>
    <PageHead
      title="Создать команду"
      subtitle="Команду может создать обычный игрок. Роль аккаунта от этого не меняется."
    />

    <form class="form-panel profile-edit-form" @submit.prevent="submitTeam">
      <div class="form-section">
        <h2 class="form-section__title">Основное</h2>
        <p class="form-section__hint">Название, спорт и город будут видны в списке команд и заявках на турниры.</p>

        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label" for="teamName">Название команды</label>
            <input id="teamName" v-model="form.name" class="form-control" type="text" required placeholder="Например, Arena Five">
          </div>

          <div class="col-md-6">
            <label class="form-label" for="teamSport">Спорт</label>
            <select id="teamSport" v-model="form.sport" class="form-select">
              <option v-for="sport in sportOptions" :key="sport.key" :value="sport.key">{{ sport.label }}</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label" for="teamCity">Город</label>
            <input id="teamCity" v-model="form.city" class="form-control" type="text" placeholder="Екатеринбург или Онлайн">
          </div>

          <div class="col-md-6">
            <label class="form-label" for="teamMaxMembers">Лимит игроков</label>
            <input id="teamMaxMembers" v-model.number="form.maxMembers" class="form-control" type="number" min="1" max="30">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2 class="form-section__title">Заявки и invite</h2>
        <p class="form-section__hint">Эти настройки можно будет поменять позже в карточке команды.</p>

        <div class="team-settings-grid">
          <label class="team-setting-switch">
            <input v-model="form.isOpenForRequests" type="checkbox">
            <span>Принимать заявки в команду</span>
          </label>
          <label class="team-setting-switch">
            <input v-model="form.notifyOnRequests" type="checkbox">
            <span>Показывать уведомления о заявках</span>
          </label>
          <label class="team-setting-switch">
            <input v-model="form.inviteJoinMode" type="radio" value="request">
            <span>По invite сначала заявка капитану</span>
          </label>
          <label class="team-setting-switch">
            <input v-model="form.inviteJoinMode" type="radio" value="direct">
            <span>По invite сразу вступление</span>
          </label>
        </div>
      </div>

      <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
      <p v-if="createdTeamId" class="form-success">
        Команда создана в мок-режиме. После backend она будет сохраняться в базе и появляться у всех игроков.
      </p>

      <div class="profile-form-actions">
        <button class="cta-button cta-button-primary" type="submit" :disabled="saving">
          {{ saving ? 'Создаём...' : 'Создать команду' }}
        </button>
        <NuxtLink class="cta-button cta-button-secondary" to="/teams">Вернуться к командам</NuxtLink>
      </div>
    </form>
  </section>
</template>
