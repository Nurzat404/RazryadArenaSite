import { useMockMatches } from '~/data/mock/state'
import type { MatchStatus, SportKey } from '~/types/domain'

export interface MatchFilters {
  tournamentId?: string
  sport?: SportKey
  teamId?: string
  status?: MatchStatus
}

export interface MatchResultPayload {
  score1: number
  score2: number
  winnerId?: string
  status?: MatchStatus
}

export const matchService = {
  async list(filters: MatchFilters = {}) {
    return useMockMatches().value
      .filter((match) => (filters.tournamentId ? match.tournamentId === filters.tournamentId : true))
      .filter((match) => (filters.sport ? match.sport === filters.sport : true))
      .filter((match) => (filters.status ? match.status === filters.status : true))
      .filter((match) => (filters.teamId ? [match.team1Id, match.team2Id].includes(filters.teamId) : true))
      .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
  },

  async getById(id: string) {
    return useMockMatches().value.find((match) => match.id === id) ?? null
  },

  async submitResult(id: string, payload: MatchResultPayload) {
    const matches = useMockMatches()
    const match = matches.value.find((item) => item.id === id)
    if (!match) return null
    const updated = { ...match, ...payload, status: payload.status ?? 'finished' as const }
    matches.value = matches.value.map((item) => item.id === id ? updated : item)
    return updated
  }
}
