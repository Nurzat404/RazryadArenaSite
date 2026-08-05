import type { Team, TeamInvite, TeamJoinRequest, TeamMember, TeamMemberBlock } from '~/types/domain'

export const mockTeams: Team[] = [
  {
    id: 't1',
    name: 'Arena Five',
    sport: 'cs2',
    city: 'Екатеринбург',
    captainId: 'u2',
    memberIds: ['u1', 'u2'],
    maxMembers: 5,
    isOpenForRequests: true,
    notifyOnRequests: true,
    inviteJoinMode: 'request',
    inviteEnabled: true,
    rating: 142
  },
  {
    id: 't2',
    name: 'Ural Kickers',
    sport: 'football',
    city: 'Екатеринбург',
    captainId: 'u1',
    memberIds: ['u1'],
    maxMembers: 11,
    isOpenForRequests: true,
    notifyOnRequests: true,
    inviteJoinMode: 'direct',
    inviteEnabled: true,
    rating: 118
  },
  {
    id: 't3',
    name: 'Dust Friends',
    sport: 'cs2',
    city: 'Онлайн',
    captainId: 'u3',
    memberIds: ['u3', 'u5'],
    maxMembers: 5,
    isOpenForRequests: true,
    notifyOnRequests: false,
    inviteJoinMode: 'request',
    inviteEnabled: true,
    rating: 131
  },
  {
    id: 't4',
    name: 'Северный блок',
    sport: 'volleyball',
    city: 'Екатеринбург',
    captainId: 'u6',
    memberIds: ['u6'],
    maxMembers: 8,
    isOpenForRequests: false,
    notifyOnRequests: false,
    inviteJoinMode: 'request',
    inviteEnabled: false,
    rating: 96
  },
  {
    id: 't5',
    name: 'Second Spawn',
    sport: 'cs2',
    city: 'Екатеринбург',
    captainId: 'u7',
    memberIds: ['u7', 'u8'],
    maxMembers: 4,
    isOpenForRequests: true,
    notifyOnRequests: true,
    inviteJoinMode: 'request',
    inviteEnabled: true,
    rating: 105
  }
]

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm1',
    teamId: 't1',
    userId: 'u2',
    role: 'captain',
    joinedAt: '2026-05-20T09:00:00.000Z'
  },
  {
    id: 'tm2',
    teamId: 't1',
    userId: 'u1',
    role: 'member',
    joinedAt: '2026-05-21T13:20:00.000Z'
  },
  {
    id: 'tm3',
    teamId: 't2',
    userId: 'u1',
    role: 'captain',
    joinedAt: '2026-05-12T16:45:00.000Z'
  },
  {
    id: 'tm4',
    teamId: 't3',
    userId: 'u3',
    role: 'captain',
    joinedAt: '2026-06-01T18:10:00.000Z'
  },
  {
    id: 'tm5',
    teamId: 't3',
    userId: 'u5',
    role: 'member',
    joinedAt: '2026-06-02T11:35:00.000Z'
  },
  {
    id: 'tm6',
    teamId: 't4',
    userId: 'u6',
    role: 'captain',
    joinedAt: '2026-05-25T12:00:00.000Z'
  },
  {
    id: 'tm7',
    teamId: 't5',
    userId: 'u7',
    role: 'captain',
    joinedAt: '2026-06-10T17:00:00.000Z'
  },
  {
    id: 'tm8',
    teamId: 't5',
    userId: 'u8',
    role: 'member',
    joinedAt: '2026-06-10T17:15:00.000Z'
  }
]

export const mockTeamInvites: TeamInvite[] = [
  {
    id: 'inv1',
    teamId: 't1',
    code: 'ARENA-FIVE-JOIN',
    createdByUserId: 'u2',
    createdAt: '2026-06-04T10:00:00.000Z',
    status: 'active'
  },
  {
    id: 'inv2',
    teamId: 't3',
    code: 'DUST-FRIENDS',
    createdByUserId: 'u3',
    createdAt: '2026-06-03T15:00:00.000Z',
    status: 'used'
  }
]

export const mockTeamJoinRequests: TeamJoinRequest[] = [
  {
    id: 'req1',
    teamId: 't1',
    userId: 'u5',
    message: 'Играю CS2 вечером, могу быть запасным на первые матчи.',
    status: 'pending',
    createdAt: '2026-06-07T13:20:00.000Z',
    updatedAt: '2026-06-07T13:20:00.000Z'
  },
  {
    id: 'req2',
    teamId: 't2',
    userId: 'u4',
    message: 'Хочу сыграть в нападении, по выходным свободна.',
    status: 'pending',
    createdAt: '2026-06-06T09:15:00.000Z',
    updatedAt: '2026-06-06T09:15:00.000Z'
  },
  {
    id: 'req3',
    teamId: 't3',
    userId: 'u1',
    message: 'Могу помочь на квалификации.',
    status: 'rejected',
    createdAt: '2026-06-04T18:00:00.000Z',
    updatedAt: '2026-06-05T10:00:00.000Z'
  }
]

export const mockTeamMemberBlocks: TeamMemberBlock[] = []
