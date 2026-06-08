<script setup lang="ts">
import { teamService, userService } from '~/services'
import type { SportKey } from '~/types/domain'

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const [teams, users] = await Promise.all([
  teamService.list(),
  userService.list()
])

const userById = new Map(users.map((user) => [user.id, user]))

useHead({
  title: 'Команды — РазрядАрена',
  bodyAttrs: {
    class: 'layout-public',
    'data-page': 'teams',
    'data-role': 'public'
  }
})
</script>

<template>
  <div class="section-padding">
    <div class="container">
      <div class="page-head">
        <h1 class="section-title">Команды</h1>
        <p class="section-subtitle">
          Составы, капитаны и команды, которые уже готовы к заявкам на турниры.
        </p>
      </div>

      <div class="profile-grid">
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
              <dt>Капитан</dt>
              <dd>{{ userById.get(team.captainId)?.name ?? 'Не найден' }}</dd>
            </div>
            <div>
              <dt>Состав</dt>
              <dd>{{ team.memberIds.length }}/{{ team.maxMembers }}</dd>
            </div>
            <div>
              <dt>Заявки</dt>
              <dd>{{ team.isOpenForRequests ? 'Открыты' : 'Закрыты' }}</dd>
            </div>
          </dl>

          <div class="profile-card__actions">
            <NuxtLink class="cta-button cta-button-primary" :to="`/teams/${team.id}`">Открыть команду</NuxtLink>
            <NuxtLink class="cta-button cta-button-secondary" to="/tournaments">Смотреть турниры</NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
