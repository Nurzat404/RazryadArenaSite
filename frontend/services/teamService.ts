import { mockTeamInvites, mockTeamMembers, mockTeams } from '~/data/mock/teams'
import type { SportKey, Team } from '~/types/domain'

export interface TeamListFilters {
  sport?: SportKey
  city?: string
  search?: string
  openOnly?: boolean
}

export interface TeamPayload {
  name: string
  sport: SportKey
  city: string
  captainId: string
  maxMembers: number
  isOpenForRequests: boolean
}

export const teamService = {
  async list(filters: TeamListFilters = {}) {
    return mockTeams.filter((team) => {
      const matchesSport = filters.sport ? team.sport === filters.sport : true
      const matchesCity = filters.city ? team.city === filters.city : true
      const matchesSearch = filters.search
        ? team.name.toLowerCase().includes(filters.search.toLowerCase())
        : true
      const matchesOpen = filters.openOnly ? team.isOpenForRequests : true

      return matchesSport && matchesCity && matchesSearch && matchesOpen
    })
  },

  async getById(id: string) {
    return mockTeams.find((team) => team.id === id) ?? null
  },

  async listByUser(userId: string) {
    const teamIds = mockTeamMembers.filter((member) => member.userId === userId).map((member) => member.teamId)
    return mockTeams.filter((team) => teamIds.includes(team.id))
  },

  async listMembers(teamId: string) {
    return mockTeamMembers.filter((member) => member.teamId === teamId)
  },

  async listInvites(teamId: string) {
    return mockTeamInvites.filter((invite) => invite.teamId === teamId)
  },

  async create(payload: TeamPayload): Promise<Team> {
    return {
      id: 'mock-new-team',
      name: payload.name,
      sport: payload.sport,
      city: payload.city,
      captainId: payload.captainId,
      memberIds: [payload.captainId],
      maxMembers: payload.maxMembers,
      isOpenForRequests: payload.isOpenForRequests,
      rating: 0
    }
  },

  async update(id: string, payload: Partial<TeamPayload>) {
    const team = mockTeams.find((item) => item.id === id)
    return team ? { ...team, ...payload } : null
  }
}
