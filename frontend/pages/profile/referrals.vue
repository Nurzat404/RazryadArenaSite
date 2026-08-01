<script setup lang="ts">
import { referralService } from '~/services'
import type { ReferralLink, SportKey } from '~/types/domain'

definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Приглашения' })

const auth = useAuthStore()

if (!auth.initialized) {
  await auth.loadCurrentUser()
}

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const links = auth.user ? await referralService.listByOwner(auth.user.id) : []

const statusLabel = (link: ReferralLink) => link.status === 'active' ? 'Активна' : 'Отключена'
</script>

<template>
  <section class="workspace-page workspace-page--profile">
    <PageHead
      title="Приглашения"
      subtitle="Ссылки для игроков и команд, которых вы зовёте на сайт."
    />

    <div v-if="links.length" class="profile-grid">
      <article v-for="link in links" :key="link.id" class="profile-card">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">{{ link.sport ? sportLabels[link.sport] : 'Все виды' }}</span>
            <h2>{{ link.title }}</h2>
          </div>
          <StatusBadge :status="link.status" :label="statusLabel(link)" />
        </div>

        <p class="profile-card__note">
          Код: <strong>{{ link.code }}</strong>
        </p>

        <dl class="profile-card__meta">
          <div>
            <dt>Пришли по ссылке</dt>
            <dd>{{ link.invitedUsersCount }}</dd>
          </div>
          <div>
            <dt>Заявки приняты</dt>
            <dd>{{ link.approvedApplicationsCount }}</dd>
          </div>
          <div>
            <dt>Очки</dt>
            <dd>{{ link.points }}</dd>
          </div>
        </dl>

        <p class="profile-card__note">
          По приглашению сыграли первый матч: {{ link.firstMatchesCount }}.
        </p>
      </article>
    </div>

    <div v-else class="empty-state-panel">
      <h2>Приглашений пока нет</h2>
      <p>Когда появится ссылка, здесь будет видно, кто пришёл на сайт и дошёл до первой заявки.</p>
      <div class="empty-state-panel__actions">
        <NuxtLink class="cta-button cta-button-primary" to="/profile">Вернуться в профиль</NuxtLink>
      </div>
    </div>
  </section>
</template>
