import { useMockTournaments } from '~/data/mock/state'
import type { SportKey, Tournament, TournamentStatus } from '~/types/domain'

export interface TournamentListFilters {
  sport?: SportKey
  city?: string
  status?: TournamentStatus
  registrationOpenOnly?: boolean
  search?: string
}

export interface TournamentPayload {
  name: string
  sport: SportKey
  city: string
  registrationStartDate: string
  registrationEndDate: string
  eventStartDate: string
  eventEndDate?: string
  maxTeams: number
  requiredTeamSize: number
  minAge?: number
  maxAge?: number
  matchFormat: string
  location: string
  rules: string[]
  mapPool?: string[]
  allowRosterChanges: boolean
  description: string
}

export const tournamentService = {
  async list(filters: TournamentListFilters = {}) {
    return useMockTournaments().value.filter((tournament) => {
      const matchesSport = filters.sport ? tournament.sport === filters.sport : true
      const matchesCity = filters.city ? tournament.city === filters.city : true
      const matchesStatus = filters.status ? tournament.status === filters.status : true
      const matchesRegistration = filters.registrationOpenOnly
        ? tournament.status === 'registration_open'
        : true
      const matchesSearch = filters.search
        ? tournament.name.toLowerCase().includes(filters.search.toLowerCase())
        : true

      return matchesSport && matchesCity && matchesStatus && matchesRegistration && matchesSearch
    })
  },

  async getById(id: string) {
    return useMockTournaments().value.find((tournament) => tournament.id === id) ?? null
  },

  async create(payload: TournamentPayload): Promise<Tournament> {
    const tournaments = useMockTournaments()
    const tournament: Tournament = {
      id: `tournament-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status: 'draft',
      ...payload
    }
    tournaments.value = [tournament, ...tournaments.value]
    return tournament
  },

  async update(id: string, payload: Partial<TournamentPayload & { status: TournamentStatus }>) {
    const tournaments = useMockTournaments()
    const tournament = tournaments.value.find((item) => item.id === id)
    if (!tournament) return null
    const updated = { ...tournament, ...payload }
    tournaments.value = tournaments.value.map((item) => item.id === id ? updated : item)
    return updated
  }
}
