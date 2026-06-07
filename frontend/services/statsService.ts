import { mockPlayerStats } from '~/data/mock/stats'
import type { SportKey } from '~/types/domain'

export const statsService = {
  async list(filters: { userId?: string; sport?: SportKey } = {}) {
    return mockPlayerStats
      .filter((stats) => (filters.userId ? stats.userId === filters.userId : true))
      .filter((stats) => (filters.sport ? stats.sport === filters.sport : true))
  },

  async getByUserAndSport(userId: string, sport: SportKey) {
    return mockPlayerStats.find((stats) => stats.userId === userId && stats.sport === sport) ?? null
  }
}
