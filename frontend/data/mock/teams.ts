import type { Team } from '~/types/domain'

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
  }
]
