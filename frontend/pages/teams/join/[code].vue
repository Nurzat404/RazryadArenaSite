<script setup lang="ts">
import { teamService } from '~/services'

definePageMeta({ layout: 'app', middleware: 'auth' })

const route = useRoute()
const auth = useAuthStore()

if (!auth.initialized) {
  await auth.loadCurrentUser()
}

const code = String(route.params.code)
const invite = await teamService.getInviteByCode(code)
const team = invite ? await teamService.getById(invite.teamId) : null
const joining = ref(false)
const resultMessage = ref('')
const errorMessage = ref('')

useHead({ title: team ? `Вступить в ${team.name}` : 'Ссылка не работает' })

const join = async () => {
  if (!auth.user) return
  joining.value = true
  errorMessage.value = ''

  try {
    const result = await teamService.joinByInvite(code, auth.user.id)
    resultMessage.value = result.mode === 'direct'
      ? 'Вы вступили в команду.'
      : 'Заявка отправлена капитану.'
  } catch (error) {
    const reason = error instanceof Error ? error.message : ''
    errorMessage.value = reason === 'team_full'
      ? 'В команде нет свободных мест.'
      : reason === 'blocked'
        ? 'Вступление для этого аккаунта ограничено.'
        : reason === 'request_exists'
          ? 'Ваша заявка уже ждёт ответа капитана.'
          : 'Ссылка больше не работает.'
  } finally {
    joining.value = false
  }
}
</script>

<template>
  <section class="workspace-page workspace-page--team">
    <PageHead
      :title="team ? `Вступить в ${team.name}` : 'Ссылка не работает'"
      :subtitle="team ? 'Проверьте команду и подтвердите действие.' : 'Попросите капитана прислать новую ссылку.'"
    />

    <article v-if="team && invite?.status === 'active' && team.inviteEnabled" class="form-panel profile-edit-form">
      <dl class="profile-card__meta">
        <div><dt>Спорт</dt><dd>{{ team.sport === 'cs2' ? 'CS2' : team.sport === 'football' ? 'Футбол' : team.sport === 'basketball' ? 'Баскетбол' : 'Волейбол' }}</dd></div>
        <div><dt>Город</dt><dd>{{ team.city }}</dd></div>
        <div><dt>Состав</dt><dd>{{ team.memberIds.length }}/{{ team.maxMembers }}</dd></div>
      </dl>

      <p class="text-muted-strong mb-0">
        {{ team.inviteJoinMode === 'direct' ? 'После подтверждения вы сразу попадёте в состав.' : 'Капитан получит заявку и решит, принимать её или нет.' }}
      </p>
      <p v-if="resultMessage" class="form-success">{{ resultMessage }}</p>
      <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>

      <div class="profile-form-actions">
        <button v-if="!resultMessage" class="cta-button cta-button-primary" type="button" :disabled="joining" @click="join">
          {{ joining ? 'Отправляем...' : team.inviteJoinMode === 'direct' ? 'Вступить в команду' : 'Отправить заявку' }}
        </button>
        <NuxtLink class="cta-button cta-button-secondary" :to="`/teams/${team.id}`">Открыть команду</NuxtLink>
      </div>
    </article>

    <div v-else class="empty-state-panel">
      <h2>Приглашение недействительно</h2>
      <p>Ссылка могла устареть или капитан отключил вступление по ней.</p>
      <NuxtLink class="cta-button cta-button-primary" to="/teams">Смотреть команды</NuxtLink>
    </div>
  </section>
</template>
