<script setup lang="ts">
import { userService } from '~/services'
import type { SportKey, UserRole } from '~/types/domain'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Пользователи' })

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const roleLabels: Record<UserRole, string> = {
  admin: 'Админ',
  player: 'Игрок'
}

const users = await userService.list()
</script>

<template>
  <section>
    <PageHead title="Пользователи" subtitle="Игроки и админы, которые уже есть в системе." />

    <div class="profile-grid">
      <article v-for="user in users" :key="user.id" class="profile-card">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">{{ roleLabels[user.role] }}</span>
            <h2>{{ user.name }}</h2>
          </div>
          <StatusBadge :status="user.emailVerified ? 'active' : 'pending'" :label="user.emailVerified ? 'Почта подтверждена' : 'Почта не подтверждена'" />
        </div>

        <p class="profile-card__note">{{ user.email }}</p>

        <dl class="profile-card__meta">
          <div>
            <dt>Город</dt>
            <dd>{{ user.city ?? 'Не указан' }}</dd>
          </div>
          <div>
            <dt>Возраст</dt>
            <dd>{{ user.age ?? 'Не указан' }}</dd>
          </div>
          <div>
            <dt>Спорт</dt>
            <dd>{{ user.favoriteSports.map((sport) => sportLabels[sport]).join(', ') }}</dd>
          </div>
        </dl>
      </article>
    </div>
  </section>
</template>
