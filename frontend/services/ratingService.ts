import { mockRatings, mockRatingSeasons } from '~/data/mock/ratings'
import type { RatingRow, SportKey } from '~/types/domain'

export interface RatingFilters {
  sport?: SportKey
  entityType?: RatingRow['entityType']
  ratingScope?: RatingRow['ratingScope']
  seasonId?: string
}

export const ratingService = {
  async seasons(sport?: SportKey) {
    return sport ? mockRatingSeasons.filter((season) => season.sport === sport) : mockRatingSeasons
  },

  async leaderboard(filters: RatingFilters = {}) {
    return mockRatings
      .filter((row) => (filters.sport ? row.sport === filters.sport : true))
      .filter((row) => (filters.entityType ? row.entityType === filters.entityType : true))
      .filter((row) => (filters.ratingScope ? row.ratingScope === filters.ratingScope : true))
      .filter((row) => (filters.seasonId ? row.seasonId === filters.seasonId : true))
      .sort((a, b) => a.position - b.position || b.points - a.points)
  },

  async getByEntity(entityId: string) {
    return mockRatings.find((row) => row.entityId === entityId) ?? null
  }
}
