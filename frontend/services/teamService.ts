import {
  useMockTeamInvites,
  useMockTeamJoinRequests,
  useMockTeamMemberBlocks,
  useMockTeamMembers,
  useMockTeams
} from '~/data/mock/state'
import type {
  SportKey,
  Team,
  TeamInviteJoinMode,
  TeamJoinRequestStatus,
  TeamMemberRole
} from '~/types/domain'

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

const uniqueId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

const syncMemberIds = (teamId: string) => {
  const teams = useMockTeams()
  const members = useMockTeamMembers()
  teams.value = teams.value.map((team) => team.id === teamId
    ? { ...team, memberIds: members.value.filter((member) => member.teamId === teamId).map((member) => member.userId) }
    : team)
}

const memberRole = (team: Team, userId: string): TeamMemberRole => team.captainId === userId ? 'captain' : 'member'

export const teamService = {
  async list(filters: TeamListFilters = {}) {
    return useMockTeams().value.filter((team) => {
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
    return useMockTeams().value.find((team) => team.id === id) ?? null
  },

  async listByUser(userId: string) {
    const teamIds = useMockTeamMembers().value
      .filter((member) => member.userId === userId)
      .map((member) => member.teamId)
    return useMockTeams().value.filter((team) => teamIds.includes(team.id))
  },

  async listMembers(teamId: string) {
    return useMockTeamMembers().value.filter((member) => member.teamId === teamId)
  },

  async listInvites(teamId: string) {
    return useMockTeamInvites().value.filter((invite) => invite.teamId === teamId)
  },

  async getInviteByCode(code: string) {
    return useMockTeamInvites().value.find((invite) => invite.code.toLowerCase() === code.toLowerCase()) ?? null
  },

  async listRequests(teamId: string, status?: TeamJoinRequestStatus) {
    return useMockTeamJoinRequests().value
      .filter((request) => request.teamId === teamId)
      .filter((request) => (status ? request.status === status : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async listBlocks(teamId: string) {
    return useMockTeamMemberBlocks().value.filter((block) => block.teamId === teamId)
  },

  async canManage(teamId: string, userId?: string, isAdmin = false) {
    if (!userId) return false
    const team = useMockTeams().value.find((item) => item.id === teamId)
    return Boolean(team && (isAdmin || team.captainId === userId))
  },

  async create(payload: TeamPayload): Promise<Team> {
    const teams = useMockTeams()
    const members = useMockTeamMembers()
    const invites = useMockTeamInvites()
    const team: Team = {
      id: uniqueId('team'),
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

    teams.value = [...teams.value, team]
    members.value = [...members.value, {
      id: uniqueId('member'),
      teamId: team.id,
      userId: payload.captainId,
      role: 'captain',
      joinedAt: new Date().toISOString()
    }]
    invites.value = [...invites.value, {
      id: uniqueId('invite'),
      teamId: team.id,
      code: `${team.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdByUserId: payload.captainId,
      createdAt: new Date().toISOString(),
      status: 'active'
    }]

    return team
  },

  async update(id: string, payload: Partial<TeamPayload>) {
    const teams = useMockTeams()
    const team = teams.value.find((item) => item.id === id)
    if (!team) return null
    const updated = { ...team, ...payload }
    teams.value = teams.value.map((item) => item.id === id ? updated : item)
    return updated
  },

  async createRequest(payload: TeamJoinRequestPayload) {
    const requests = useMockTeamJoinRequests()
    const teams = useMockTeams()
    const members = useMockTeamMembers()
    const blocks = useMockTeamMemberBlocks()
    const team = teams.value.find((item) => item.id === payload.teamId)

    if (!team || !team.isOpenForRequests) throw new Error('requests_closed')
    if (members.value.some((member) => member.teamId === payload.teamId && member.userId === payload.userId)) throw new Error('already_member')
    if (blocks.value.some((block) => block.teamId === payload.teamId && block.userId === payload.userId)) throw new Error('blocked')
    if (requests.value.some((request) => request.teamId === payload.teamId && request.userId === payload.userId && request.status === 'pending')) throw new Error('request_exists')

    const now = new Date().toISOString()
    const request = {
      id: uniqueId('request'),
      status: 'pending' as const,
      createdAt: now,
      updatedAt: now,
      ...payload
    }
    requests.value = [...requests.value, request]
    return request
  },

  async cancelRequest(teamId: string, userId: string) {
    const requests = useMockTeamJoinRequests()
    const request = requests.value.find((item) => item.teamId === teamId && item.userId === userId && item.status === 'pending')
    if (!request) return false
    requests.value = requests.value.filter((item) => item.id !== request.id)
    return true
  },

  async updateRequestStatus(id: string, status: TeamJoinRequestStatus) {
    const requests = useMockTeamJoinRequests()
    const request = requests.value.find((item) => item.id === id)
    if (!request) return null

    if (status === 'accepted') {
      await this.addMember(request.teamId, request.userId)
    }

    const updated = { ...request, status, updatedAt: new Date().toISOString() }
    requests.value = requests.value.map((item) => item.id === id ? updated : item)
    return updated
  },

  async addMember(teamId: string, userId: string) {
    const teams = useMockTeams()
    const members = useMockTeamMembers()
    const blocks = useMockTeamMemberBlocks()
    const team = teams.value.find((item) => item.id === teamId)
    if (!team) throw new Error('team_not_found')
    if (blocks.value.some((block) => block.teamId === teamId && block.userId === userId)) throw new Error('blocked')
    if (members.value.some((member) => member.teamId === teamId && member.userId === userId)) return team
    if (team.memberIds.length >= team.maxMembers) throw new Error('team_full')

    members.value = [...members.value, {
      id: uniqueId('member'),
      teamId,
      userId,
      role: memberRole(team, userId),
      joinedAt: new Date().toISOString()
    }]
    syncMemberIds(teamId)
    return useMockTeams().value.find((item) => item.id === teamId) ?? team
  },

  async removeMember(teamId: string, userId: string) {
    const team = useMockTeams().value.find((item) => item.id === teamId)
    if (!team || team.captainId === userId) return false
    const members = useMockTeamMembers()
    members.value = members.value.filter((member) => !(member.teamId === teamId && member.userId === userId))
    syncMemberIds(teamId)
    return true
  },

  async transferCaptain(teamId: string, newCaptainId: string) {
    const teams = useMockTeams()
    const members = useMockTeamMembers()
    const team = teams.value.find((item) => item.id === teamId)
    if (!team || !members.value.some((member) => member.teamId === teamId && member.userId === newCaptainId)) return null

    teams.value = teams.value.map((item) => item.id === teamId ? { ...item, captainId: newCaptainId } : item)
    members.value = members.value.map((member) => member.teamId !== teamId
      ? member
      : { ...member, role: member.userId === newCaptainId ? 'captain' : 'member' })
    return teams.value.find((item) => item.id === teamId) ?? null
  },

  async leave(teamId: string, userId: string, replacementCaptainId?: string) {
    const team = useMockTeams().value.find((item) => item.id === teamId)
    if (!team) return false
    if (team.captainId === userId) {
      if (!replacementCaptainId) throw new Error('captain_replacement_required')
      await this.transferCaptain(teamId, replacementCaptainId)
    }
    return this.removeMember(teamId, userId)
  },

  async delete(teamId: string) {
    const teams = useMockTeams()
    const members = useMockTeamMembers()
    const invites = useMockTeamInvites()
    const requests = useMockTeamJoinRequests()
    const blocks = useMockTeamMemberBlocks()
    teams.value = teams.value.filter((team) => team.id !== teamId)
    members.value = members.value.filter((member) => member.teamId !== teamId)
    invites.value = invites.value.filter((invite) => invite.teamId !== teamId)
    requests.value = requests.value.filter((request) => request.teamId !== teamId)
    blocks.value = blocks.value.filter((block) => block.teamId !== teamId)
    return true
  },

  async blockMember(teamId: string, userId: string, blockedByUserId: string, reason?: string) {
    const blocks = useMockTeamMemberBlocks()
    if (!blocks.value.some((block) => block.teamId === teamId && block.userId === userId)) {
      blocks.value = [...blocks.value, {
        id: uniqueId('block'),
        teamId,
        userId,
        blockedByUserId,
        reason,
        createdAt: new Date().toISOString()
      }]
    }
    await this.removeMember(teamId, userId)
    return true
  },

  async unblockMember(teamId: string, userId: string) {
    const blocks = useMockTeamMemberBlocks()
    blocks.value = blocks.value.filter((block) => !(block.teamId === teamId && block.userId === userId))
    return true
  },

  async regenerateInvite(teamId: string, createdByUserId: string) {
    const teams = useMockTeams()
    const invites = useMockTeamInvites()
    const team = teams.value.find((item) => item.id === teamId)
    if (!team) throw new Error('team_not_found')

    invites.value = invites.value.map((invite) => invite.teamId === teamId && invite.status === 'active'
      ? { ...invite, status: 'revoked' as const }
      : invite)
    const prefix = team.name.toUpperCase().replace(/[^A-ZА-Я0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 18) || 'TEAM'
    const invite = {
      id: uniqueId('invite'),
      teamId,
      code: `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdByUserId,
      createdAt: new Date().toISOString(),
      status: 'active' as const
    }
    invites.value = [...invites.value, invite]
    return invite
  },

  async joinByInvite(code: string, userId: string) {
    const invite = await this.getInviteByCode(code)
    if (!invite || invite.status !== 'active') throw new Error('invite_invalid')
    const team = await this.getById(invite.teamId)
    if (!team || !team.inviteEnabled) throw new Error('invite_disabled')

    if (team.inviteJoinMode === 'direct') {
      await this.addMember(team.id, userId)
      return { team, mode: 'direct' as const }
    }

    await this.createRequest({ teamId: team.id, userId, message: 'Заявка по ссылке для вступления.' })
    return { team, mode: 'request' as const }
  }
}
