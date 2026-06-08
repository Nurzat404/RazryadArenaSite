<script setup lang="ts">
import { ratingService } from '~/services'
import type { RatingRow, SportKey } from '~/types/domain'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Рейтинги в админке' })

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const entityTypeLabels: Record<RatingRow['entityType'], string> = {
  player: 'Игрок',
  team: 'Команда'
}

const [ratings, seasons] = await Promise.all([
  ratingService.leaderboard(),
  ratingService.seasons()
])

const ratingColumns = [
  { key: 'position', label: 'Место' },
  { key: 'entityName', label: 'Название' },
  { key: 'entityType', label: 'Тип' },
  { key: 'sport', label: 'Спорт' },
  { key: 'points', label: 'Очки', align: 'end' as const }
]

const ratingRows = ratings.map((row) => ({
  id: row.id,
  position: row.position,
  entityName: row.entityName,
  entityType: entityTypeLabels[row.entityType],
  sport: sportLabels[row.sport],
  points: row.points
}))
</script>

<template>
  <section>
    <PageHead title="Рейтинги" subtitle="Очки игроков и команд по текущим сезонам." />

    <div class="profile-grid mb-3">
      <article v-for="season in seasons" :key="season.id" class="profile-card">
        <div class="profile-card__head">
          <div>
            <span class="profile-card__badge">{{ sportLabels[season.sport] }}</span>
            <h2>{{ season.title }}</h2>
          </div>
          <StatusBadge :status="season.active ? 'active' : 'finished'" :label="season.active ? 'Активен' : 'Закрыт'" />
        </div>
      </article>
    </div>

    <div class="surface-panel p-3">
      <BaseTable
        :columns="ratingColumns"
        :rows="ratingRows"
      />
    </div>
  </section>
</template>
