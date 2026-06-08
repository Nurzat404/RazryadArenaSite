<script setup lang="ts">
import { teamService, userService } from '~/services'
import type { SportKey } from '~/types/domain'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Команды в админке' })

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
</script>

<template>
  <section>
    <PageHead title="Команды" subtitle="Составы, капитаны и готовность к заявкам на турниры." />

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
          <NuxtLink class="cta-button cta-button-secondary" :to="`/teams/${team.id}`">Открыть команду</NuxtLink>
        </div>
      </article>
    </div>
  </section>
</template>
