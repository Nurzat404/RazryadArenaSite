import type { TournamentRoster } from '~/types/domain'

export const mockTournamentRosters: TournamentRoster[] = [
  {
    id: 'roster1',
    tournamentId: 'tr1',
    teamId: 't1',
    playerIds: ['u1', 'u2'],
    captainId: 'u2',
    submittedAt: '2026-06-03T10:25:00.000Z',
    locked: false
  },
  {
    id: 'roster2',
    tournamentId: 'tr1',
    teamId: 't3',
    playerIds: ['u3', 'u5'],
    captainId: 'u3',
    submittedAt: '2026-06-06T15:45:00.000Z',
    locked: false
  },
  {
    id: 'roster3',
    tournamentId: 'tr2',
    teamId: 't2',
    playerIds: ['u1'],
    captainId: 'u1',
    submittedAt: '2026-05-15T08:35:00.000Z',
    locked: true
  }
]
