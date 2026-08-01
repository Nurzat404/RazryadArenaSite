<script setup lang="ts">
import { teamService } from '~/services'
import type { SportKey } from '~/types/domain'

definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Мои команды' })

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

const teams = auth.user ? await teamService.listByUser(auth.user.id) : []
</script>

<template>
  <section class="workspace-page workspace-page--profile">
    <PageHead
      title="Мои команды"
      subtitle="Команды, в которых вы играете или отвечаете за состав."
    />

    <div v-if="teams.length" class="profile-grid">
      <article v-for="team in teams" :key="team.id" class="profile-card">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">{{ sportLabels[team.sport] }}</span>
            <h2>{{ team.name }}</h2>
          </div>
          <strong>{{ team.rating }}</strong>
        </div>

        <dl class="profile-card__meta">
          <div>
            <dt>Город</dt>
            <dd>{{ team.city }}</dd>
          </div>
          <div>
            <dt>Состав</dt>
            <dd>{{ team.memberIds.length }}/{{ team.maxMembers }}</dd>
          </div>
          <div>
            <dt>Заявки в команду</dt>
            <dd>{{ team.isOpenForRequests ? 'Открыты' : 'Закрыты' }}</dd>
          </div>
        </dl>

        <div class="profile-card__actions">
          <NuxtLink class="cta-button cta-button-secondary" :to="`/teams/${team.id}`">Открыть команду</NuxtLink>
        </div>
      </article>
    </div>

    <div v-else class="empty-state-panel">
      <h2>Команды пока нет</h2>
      <p>Создайте свою команду или найдите открытую. После вступления она появится здесь.</p>
      <div class="empty-state-panel__actions">
        <NuxtLink class="cta-button cta-button-primary" to="/teams">Смотреть команды</NuxtLink>
      </div>
    </div>
  </section>
</template>
