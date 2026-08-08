import { mockRatingSeasons } from '~/data/mock/ratings'
import { useMockMatchRatingEvents, useMockRatings, useMockTeams, useMockUsers } from '~/data/mock/state'
import type { MatchRatingEvent } from '~/types/domain'
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
    const baseRows = useMockRatings().value.map((row) => ({ ...row }))
    const teams = useMockTeams().value
    const users = useMockUsers().value
    const events = useMockMatchRatingEvents().value

    const ensureRow = (entityId: string, entityType: RatingRow['entityType'], sport: SportKey) => {
      let row = baseRows.find((item) => item.entityId === entityId && item.entityType === entityType && item.sport === sport && item.ratingScope === 'overall')
      if (!row) {
        row = {
          id: `overall-${entityType}-${entityId}`,
          entityId,
          entityName: entityType === 'team'
            ? teams.find((team) => team.id === entityId)?.name ?? 'Команда'
            : users.find((user) => user.id === entityId)?.name ?? 'Игрок',
          entityType,
          sport,
          ratingScope: 'overall',
          points: 0,
          position: 0
        }
        baseRows.push(row)
      }
      return row
    }

    events.forEach((event) => {
      ensureRow(event.winnerTeamId, 'team', event.sport).points += 10
      ensureRow(event.loserTeamId, 'team', event.sport).points += 2
      event.winnerPlayerIds.forEach((userId) => { ensureRow(userId, 'player', event.sport).points += 5 })
      event.loserPlayerIds.forEach((userId) => { ensureRow(userId, 'player', event.sport).points += 1 })
    })

    const rows = baseRows
      .filter((row) => (filters.sport ? row.sport === filters.sport : true))
      .filter((row) => (filters.entityType ? row.entityType === filters.entityType : true))
      .filter((row) => (filters.ratingScope ? row.ratingScope === filters.ratingScope : true))
      .filter((row) => (filters.seasonId ? row.seasonId === filters.seasonId : true))
      .sort((a, b) => b.points - a.points)
    const rankGroups = new Map<string, number>()
    return rows.map((row) => {
      const key = `${row.sport}:${row.entityType}:${row.ratingScope ?? 'overall'}:${row.seasonId ?? ''}`
      const position = (rankGroups.get(key) ?? 0) + 1
      rankGroups.set(key, position)
      return { ...row, position }
    })
  },

  async getByEntity(entityId: string) {
    return (await this.leaderboard()).find((row) => row.entityId === entityId) ?? null
  },

  async recordMatch(event: MatchRatingEvent) {
    const events = useMockMatchRatingEvents()
    events.value = [...events.value.filter((item) => item.matchId !== event.matchId), event]
    return event
  }
}
