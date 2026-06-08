<script setup lang="ts">
import { teamService } from '~/services'
import type { TeamInvite } from '~/types/domain'

definePageMeta({ layout: 'app', middleware: 'auth' })

const route = useRoute()
const auth = useAuthStore()

if (!auth.initialized) {
  await auth.loadCurrentUser()
}

const teamId = String(route.params.id)
const [team, invites] = await Promise.all([
  teamService.getById(teamId),
  teamService.listInvites(teamId)
])

useHead({
  title: team ? `Invite ${team.name}` : 'Invite команды'
})

const activeInvite = ref<TeamInvite | null>(invites.find((invite) => invite.status === 'active') ?? null)
const copied = ref(false)
const regenerated = ref(false)

const inviteUrl = computed(() => activeInvite.value
  ? `https://razryadarena.ru/teams/join/${activeInvite.value.code}`
  : ''
)

const regenerate = async () => {
  if (!team || !auth.user) {
    return
  }

  activeInvite.value = await teamService.regenerateInvite(team.id, auth.user.id)
  regenerated.value = true
  copied.value = false
}

const copyInvite = async () => {
  copied.value = false

  if (!inviteUrl.value) {
    return
  }

  if (import.meta.client && navigator.clipboard) {
    await navigator.clipboard.writeText(inviteUrl.value)
  }

  copied.value = true
}
</script>

<template>
  <section>
    <PageHead
      :title="team ? `Invite: ${team.name}` : 'Команда не найдена'"
      subtitle="Ссылка для приглашения игроков. Сейчас это мок, после backend ссылка будет работать для других аккаунтов."
    />

    <div v-if="team" class="profile-grid">
      <article class="profile-card profile-card--wide">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">{{ team.inviteEnabled ? 'Invite включён' : 'Invite выключен' }}</span>
            <h2>{{ activeInvite?.code ?? 'Активной ссылки нет' }}</h2>
          </div>
        </div>

        <dl class="profile-card__meta">
          <div>
            <dt>Режим</dt>
            <dd>{{ team.inviteJoinMode === 'direct' ? 'Сразу в команду' : 'Сначала заявка' }}</dd>
          </div>
          <div>
            <dt>Статус</dt>
            <dd>{{ activeInvite?.status === 'active' ? 'Активна' : 'Нет активной' }}</dd>
          </div>
          <div>
            <dt>Заявки</dt>
            <dd>{{ team.isOpenForRequests ? 'Открыты' : 'Закрыты' }}</dd>
          </div>
        </dl>

        <div v-if="activeInvite" class="team-invite-box">
          <span>{{ inviteUrl }}</span>
        </div>

        <p class="profile-card__note">
          Если режим стоит “сначала заявка”, игрок появится во входящих заявках. Если “сразу в команду”, после backend он будет добавляться без ручного подтверждения.
        </p>

        <p v-if="copied" class="form-success">Ссылка скопирована.</p>
        <p v-if="regenerated" class="form-success">Новая ссылка создана в мок-режиме.</p>

        <div class="profile-card__actions">
          <button class="cta-button cta-button-primary" type="button" :disabled="!activeInvite" @click="copyInvite">
            Скопировать ссылку
          </button>
          <button class="cta-button cta-button-secondary" type="button" @click="regenerate">
            Создать новую
          </button>
          <NuxtLink class="cta-button cta-button-secondary" :to="`/teams/${team.id}/edit`">Настройки invite</NuxtLink>
        </div>
      </article>

      <article class="profile-card">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">История</span>
            <h2>{{ invites.length }} ссылок</h2>
          </div>
        </div>

        <div class="team-list-stack">
          <div v-for="invite in invites" :key="invite.id" class="team-list-row">
            <div>
              <strong>{{ invite.code }}</strong>
              <span>{{ invite.status }}</span>
            </div>
            <small>{{ new Date(invite.createdAt).toLocaleDateString('ru-RU') }}</small>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="empty-state-panel">
      <h2>Команда не найдена</h2>
      <NuxtLink class="cta-button cta-button-primary" to="/teams">К списку команд</NuxtLink>
    </div>
  </section>
</template>
