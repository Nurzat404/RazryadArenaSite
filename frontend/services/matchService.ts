import { useMockMatches, useMockTournaments } from '~/data/mock/state'
import type { BracketMatch, Match, MatchStatus, SportKey } from '~/types/domain'

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
  },

  async createForBracket(bracketMatch: BracketMatch) {
    if (!bracketMatch.team1Id || !bracketMatch.team2Id) return null
    const matches = useMockMatches()
    const existing = bracketMatch.matchId
      ? matches.value.find((match) => match.id === bracketMatch.matchId)
      : matches.value.find((match) => match.id === `match-${bracketMatch.id}`)
    if (existing) return existing

    const tournament = useMockTournaments().value.find((item) => item.id === bracketMatch.tournamentId)
    if (!tournament) return null
    const tournamentMatches = matches.value.filter((match) => match.tournamentId === tournament.id)
    const latestTime = Math.max(Date.now(), ...tournamentMatches.map((match) => new Date(match.scheduledAt).getTime()))
    const match: Match = {
      id: `match-${bracketMatch.id}`,
      tournamentId: tournament.id,
      sport: tournament.sport,
      team1Id: bracketMatch.team1Id,
      team2Id: bracketMatch.team2Id,
      scheduledAt: new Date(latestTime + 2 * 60 * 60 * 1000).toISOString(),
      location: tournament.location,
      status: 'scheduled',
      sequenceNo: Math.max(0, ...tournamentMatches.map((item) => item.sequenceNo ?? 0)) + 1
    }
    matches.value = [...matches.value, match]
    return match
  },

  async syncSequentialQueue(tournamentId: string) {
    const tournament = useMockTournaments().value.find((item) => item.id === tournamentId)
    if (tournament?.scheduleMode !== 'sequential') return []

    const matches = useMockMatches()
    const pending = matches.value
      .filter((match) => match.tournamentId === tournamentId && ['scheduled', 'active'].includes(match.status))
      .sort((a, b) => (a.sequenceNo ?? Number.MAX_SAFE_INTEGER) - (b.sequenceNo ?? Number.MAX_SAFE_INTEGER) || a.scheduledAt.localeCompare(b.scheduledAt))
    const activeId = pending.find((match) => match.status === 'active')?.id ?? pending[0]?.id
    const positions = new Map(pending.map((match, index) => [match.id, index + 1]))

    matches.value = matches.value.map((match) => match.tournamentId !== tournamentId || !positions.has(match.id)
      ? match
      : {
          ...match,
          sequenceNo: positions.get(match.id),
          status: match.id === activeId ? 'active' as const : 'scheduled' as const
        })
    return matches.value.filter((match) => match.tournamentId === tournamentId && positions.has(match.id))
  }
}
