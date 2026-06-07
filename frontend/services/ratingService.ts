import { mockRatings, mockRatingSeasons } from '~/data/mock/ratings'
import type { RatingRow, SportKey } from '~/types/domain'

export interface RatingFilters {
  sport?: SportKey
  entityType?: RatingRow['entityType']
}

export const ratingService = {
  async seasons(sport?: SportKey) {
    return sport ? mockRatingSeasons.filter((season) => season.sport === sport) : mockRatingSeasons
  },

  async leaderboard(filters: RatingFilters = {}) {
    return mockRatings
      .filter((row) => (filters.sport ? row.sport === filters.sport : true))
      .filter((row) => (filters.entityType ? row.entityType === filters.entityType : true))
      .sort((a, b) => a.position - b.position)
  },

  async getByEntity(entityId: string) {
    return mockRatings.find((row) => row.entityId === entityId) ?? null
  }
}
