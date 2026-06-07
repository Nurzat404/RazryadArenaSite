import type { TournamentApplication } from '~/types/domain'

export const mockTournamentApplications: TournamentApplication[] = [
  {
    id: 'app1',
    tournamentId: 'tr1',
    teamId: 't1',
    captainId: 'u2',
    status: 'approved',
    createdAt: '2026-06-03T10:20:00.000Z',
    updatedAt: '2026-06-03T12:10:00.000Z',
    comment: 'Состав доберём до старта регистрации.'
  },
  {
    id: 'app2',
    tournamentId: 'tr1',
    teamId: 't3',
    captainId: 'u3',
    status: 'pending',
    createdAt: '2026-06-06T15:40:00.000Z',
    updatedAt: '2026-06-06T15:40:00.000Z',
    comment: 'Пять игроков будут готовы к 20 июня.'
  },
  {
    id: 'app3',
    tournamentId: 'tr2',
    teamId: 't2',
    captainId: 'u1',
    status: 'approved',
    createdAt: '2026-05-15T08:30:00.000Z',
    updatedAt: '2026-05-16T09:00:00.000Z'
  },
  {
    id: 'app4',
    tournamentId: 'tr3',
    teamId: 't4',
    captainId: 'u6',
    status: 'rejected',
    createdAt: '2026-05-27T11:15:00.000Z',
    updatedAt: '2026-05-27T14:50:00.000Z',
    rejectReason: 'Не хватает игроков в заявочном составе.'
  }
]
