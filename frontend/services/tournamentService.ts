import { mockTournaments } from '~/data/mock/tournaments'
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
  description: string
}

export const tournamentService = {
  async list(filters: TournamentListFilters = {}) {
    return mockTournaments.filter((tournament) => {
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
    return mockTournaments.find((tournament) => tournament.id === id) ?? null
  },

  async create(payload: TournamentPayload): Promise<Tournament> {
    return {
      id: 'mock-new-tournament',
      status: 'draft',
      ...payload
    }
  },

  async update(id: string, payload: Partial<TournamentPayload & { status: TournamentStatus }>) {
    const tournament = mockTournaments.find((item) => item.id === id)
    return tournament ? { ...tournament, ...payload } : null
  }
}
