<script setup lang="ts">
import { ratingService } from '~/services'
import type { RatingRow, RatingSeason, SportKey } from '~/types/domain'

type SportTabValue = 'all' | SportKey

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

const entityHeadingLabels: Record<RatingRow['entityType'], string> = {
  player: 'Игроки',
  team: 'Команды'
}

const sportTabs: { label: string; value: SportTabValue }[] = [
  { label: 'Все спорты', value: 'all' },
  { label: 'CS2', value: 'cs2' },
  { label: 'Футбол', value: 'football' },
  { label: 'Баскетбол', value: 'basketball' },
  { label: 'Волейбол', value: 'volleyball' }
]

const entityTabs: { label: string; value: RatingRow['entityType'] }[] = [
  { label: 'Команды', value: 'team' },
  { label: 'Игроки', value: 'player' }
]

const ratingColumns = [
  { key: 'position', label: 'Место' },
  { key: 'entityName', label: 'Участник' },
  { key: 'entityType', label: 'Тип' },
  { key: 'sport', label: 'Спорт' },
  { key: 'points', label: 'Очки', align: 'end' as const }
]

const [ratings, seasons] = await Promise.all([
  ratingService.leaderboard(),
  ratingService.seasons()
])

const selectedSport = ref<SportTabValue>('all')
const selectedEntity = ref<RatingRow['entityType']>('team')
const selectedSeasonBySport = reactive<Partial<Record<SportKey, string>>>({})

const seasonsBySport = computed(() => {
  return seasons.reduce<Record<SportKey, RatingSeason[]>>((acc, season) => {
    acc[season.sport].push(season)
    return acc
  }, {
    cs2: [],
    football: [],
    basketball: [],
    volleyball: []
  })
})

const selectedSportLabel = computed(() => {
  return sportTabs.find((tab) => tab.value === selectedSport.value)?.label ?? 'Все спорты'
})

const activeSportSeasons = computed(() => {
  if (selectedSport.value === 'all') {
    return []
  }

  return seasonsBySport.value[selectedSport.value]
})

const selectedSeason = computed(() => {
  if (selectedSport.value === 'all') {
    return null
  }

  const sportSeasons = activeSportSeasons.value
  const selectedId = selectedSeasonBySport[selectedSport.value]
  return sportSeasons.find((season) => season.id === selectedId)
    ?? sportSeasons.find((season) => season.active)
    ?? sportSeasons[0]
    ?? null
})

const selectedSeasonIndex = computed(() => {
  if (!selectedSeason.value) {
    return -1
  }

  return activeSportSeasons.value.findIndex((season) => season.id === selectedSeason.value?.id)
})

const hasPreviousSeason = computed(() => selectedSeasonIndex.value >= 0 && selectedSeasonIndex.value < activeSportSeasons.value.length - 1)
const hasNextSeason = computed(() => selectedSeasonIndex.value > 0)

const filteredRatings = computed(() => {
  return ratings
    .filter((row) => row.entityType === selectedEntity.value)
    .filter((row) => {
      if (selectedSport.value === 'all') {
        return row.ratingScope === 'overall'
      }

      return row.sport === selectedSport.value
        && row.ratingScope === 'seasonal'
        && row.seasonId === selectedSeason.value?.id
    })
})

const ratingRows = computed(() => {
  return filteredRatings.value.map((row) => ({
    id: row.id,
    position: row.position,
    entityName: row.entityName,
    entityType: entityTypeLabels[row.entityType],
    sport: sportLabels[row.sport],
    points: row.points
  }))
})

const setAdjacentSeason = (direction: 'previous' | 'next') => {
  if (selectedSport.value === 'all' || selectedSeasonIndex.value < 0) {
    return
  }

  const nextIndex = direction === 'previous'
    ? selectedSeasonIndex.value + 1
    : selectedSeasonIndex.value - 1
  const season = activeSportSeasons.value[nextIndex]

  if (season) {
    selectedSeasonBySport[selectedSport.value] = season.id
  }
}

watch(selectedSport, (sport) => {
  if (sport === 'all' || selectedSeasonBySport[sport]) {
    return
  }

  const activeSeason = seasonsBySport.value[sport].find((season) => season.active)
    ?? seasonsBySport.value[sport][0]

  if (activeSeason) {
    selectedSeasonBySport[sport] = activeSeason.id
  }
}, { immediate: true })

useHead({
  title: 'Рейтинг — РазрядАрена',
  meta: [
    {
      name: 'description',
      content: 'Рейтинг команд и игроков РазрядАрены по видам спорта и сезонам.'
    }
  ],
  bodyAttrs: {
    class: 'layout-public',
    'data-page': 'ratings',
    'data-role': 'public'
  }
})
</script>

<template>
  <div class="section-padding">
    <div class="container">
      <div class="page-head">
        <h1 class="section-title">Рейтинг</h1>
        <p class="section-subtitle">
          Таблица команд и игроков по сыгранным матчам. Выберите спорт и нужный список.
        </p>
      </div>

      <section class="ratings-board mt-3" aria-label="Рейтинг участников">
        <div class="ratings-board__controls">
          <div>
            <p class="eyebrow mb-2">Спорт</p>
            <BaseTabs v-model="selectedSport" :tabs="sportTabs" aria-label="Виды спорта в рейтинге" />
          </div>

          <div>
            <p class="eyebrow mb-2">Список</p>
            <BaseTabs v-model="selectedEntity" :tabs="entityTabs" aria-label="Тип участников рейтинга" />
          </div>
        </div>

        <div v-if="selectedSport !== 'all' && selectedSeason" class="ratings-season-switcher">
          <button
            class="ratings-season-switcher__button"
            type="button"
            :disabled="!hasPreviousSeason"
            @click="setAdjacentSeason('previous')"
          >
            Предыдущий
          </button>
          <div>
            <span>Сезон</span>
            <strong>{{ selectedSeason.title }}</strong>
          </div>
          <button
            class="ratings-season-switcher__button"
            type="button"
            :disabled="!hasNextSeason"
            @click="setAdjacentSeason('next')"
          >
            Следующий
          </button>
        </div>

        <div class="ratings-board__title">
          <h2>{{ selectedSportLabel }} · {{ entityHeadingLabels[selectedEntity] }}</h2>
        </div>

        <BaseTable
          :columns="ratingColumns"
          :rows="ratingRows"
          empty-text="В этом разделе пока нет участников."
        />
      </section>
    </div>
  </div>
</template>
