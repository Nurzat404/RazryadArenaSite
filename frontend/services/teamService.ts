import { mockTeamInvites, mockTeamJoinRequests, mockTeamMembers, mockTeams } from '~/data/mock/teams'
import type { SportKey, Team, TeamInviteJoinMode, TeamJoinRequestStatus } from '~/types/domain'

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
  notifyOnRequests?: boolean
  inviteJoinMode?: TeamInviteJoinMode
  inviteEnabled?: boolean
}

export interface TeamJoinRequestPayload {
  teamId: string
  userId: string
  message?: string
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

  async listRequests(teamId: string, status?: TeamJoinRequestStatus) {
    return mockTeamJoinRequests
      .filter((request) => request.teamId === teamId)
      .filter((request) => (status ? request.status === status : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async create(payload: TeamPayload): Promise<Team> {
    return {
      id: `mock-team-${Date.now()}`,
      name: payload.name,
      sport: payload.sport,
      city: payload.city,
      captainId: payload.captainId,
      memberIds: [payload.captainId],
      maxMembers: payload.maxMembers,
      isOpenForRequests: payload.isOpenForRequests,
      notifyOnRequests: payload.notifyOnRequests ?? true,
      inviteJoinMode: payload.inviteJoinMode ?? 'request',
      inviteEnabled: payload.inviteEnabled ?? true,
      rating: 0
    }
  },

  async update(id: string, payload: Partial<TeamPayload>) {
    const team = mockTeams.find((item) => item.id === id)
    return team ? { ...team, ...payload } : null
  },

  async createRequest(payload: TeamJoinRequestPayload) {
    const now = new Date().toISOString()

    return {
      id: `mock-team-request-${Date.now()}`,
      status: 'pending' as const,
      createdAt: now,
      updatedAt: now,
      ...payload
    }
  },

  async updateRequestStatus(id: string, status: TeamJoinRequestStatus) {
    const request = mockTeamJoinRequests.find((item) => item.id === id)
    return request ? { ...request, status, updatedAt: new Date().toISOString() } : null
  },

  async regenerateInvite(teamId: string, createdByUserId: string) {
    const team = mockTeams.find((item) => item.id === teamId)
    const prefix = team?.name
      .toUpperCase()
      .replace(/[^A-ZА-Я0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 18) || 'TEAM'

    return {
      id: `mock-invite-${Date.now()}`,
      teamId,
      code: `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdByUserId,
      createdAt: new Date().toISOString(),
      status: 'active' as const
    }
  }
}
