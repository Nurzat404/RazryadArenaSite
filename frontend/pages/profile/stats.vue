<script setup lang="ts">
import { statsService } from '~/services'
import type { PlayerStats, SportKey } from '~/types/domain'

definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Моя статистика' })

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

const stats = auth.user ? await statsService.list({ userId: auth.user.id }) : []

const winRate = (item: PlayerStats) =>
  item.matchesPlayed ? Math.round((item.wins / item.matchesPlayed) * 100) : 0
</script>

<template>
  <section>
    <PageHead
      title="Моя статистика"
      subtitle="Матчи, победы и игровые показатели по видам спорта."
    />

    <div v-if="stats.length" class="profile-grid">
      <article v-for="item in stats" :key="item.id" class="profile-card">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">{{ sportLabels[item.sport] }}</span>
            <h2>{{ item.matchesPlayed }} матчей</h2>
          </div>
          <strong>{{ item.rating }}</strong>
        </div>

        <dl class="profile-card__meta">
          <div>
            <dt>Победы</dt>
            <dd>{{ item.wins }}</dd>
          </div>
          <div>
            <dt>Поражения</dt>
            <dd>{{ item.losses }}</dd>
          </div>
          <div>
            <dt>Winrate</dt>
            <dd>{{ winRate(item) }}%</dd>
          </div>
        </dl>

        <dl v-if="item.sport === 'cs2'" class="profile-card__meta">
          <div>
            <dt>K / D / A</dt>
            <dd>{{ item.cs2Kills }} / {{ item.cs2Deaths }} / {{ item.cs2Assists }}</dd>
          </div>
          <div>
            <dt>ADR</dt>
            <dd>{{ item.cs2Adr }}</dd>
          </div>
          <div>
            <dt>HS</dt>
            <dd>{{ item.cs2HeadshotPercent }}%</dd>
          </div>
        </dl>

        <dl v-else class="profile-card__meta">
          <div v-if="item.goals !== undefined">
            <dt>Голы</dt>
            <dd>{{ item.goals }}</dd>
          </div>
          <div v-if="item.assists !== undefined">
            <dt>Передачи</dt>
            <dd>{{ item.assists }}</dd>
          </div>
          <div v-if="item.setsWon !== undefined">
            <dt>Сеты</dt>
            <dd>{{ item.setsWon }}</dd>
          </div>
        </dl>
      </article>
    </div>

    <div v-else class="empty-state-panel">
      <h2>Статистика появится после матчей</h2>
      <p>Когда сыграете первые матчи и результаты подтвердят, здесь появятся победы, рейтинг и игровые показатели.</p>
      <div class="empty-state-panel__actions">
        <NuxtLink class="cta-button cta-button-primary" to="/matches">Открыть матчи</NuxtLink>
      </div>
    </div>
  </section>
</template>
