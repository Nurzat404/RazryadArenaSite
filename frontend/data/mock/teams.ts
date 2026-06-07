import type { Team, TeamInvite, TeamMember } from '~/types/domain'

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
    rating: 96
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
  }
]

export const mockTeamInvites: TeamInvite[] = [
  {
    id: 'inv1',
    teamId: 't1',
    code: 'ARENA-FIVE-JOIN',
    createdByUserId: 'u2',
    createdAt: '2026-06-04T10:00:00.000Z',
    expiresAt: '2026-06-20T10:00:00.000Z',
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
