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
  },
  {
    id: 'roster4',
    tournamentId: 'tr3',
    teamId: 't4',
    playerIds: ['u6'],
    captainId: 'u6',
    submittedAt: '2026-06-10T10:05:00.000Z',
    locked: true
  },
  {
    id: 'roster5',
    tournamentId: 'tr3',
    teamId: 't6',
    playerIds: ['u4'],
    captainId: 'u4',
    submittedAt: '2026-06-10T10:20:00.000Z',
    locked: true
  },
  {
    id: 'roster6',
    tournamentId: 'tr1',
    teamId: 't5',
    playerIds: ['u7', 'u8'],
    captainId: 'u7',
    submittedAt: '2026-06-08T11:05:00.000Z',
    locked: true
  },
  {
    id: 'roster7',
    tournamentId: 'tr1',
    teamId: 't7',
    playerIds: ['u9'],
    captainId: 'u9',
    submittedAt: '2026-06-08T11:20:00.000Z',
    locked: true
  },
  {
    id: 'roster8',
    tournamentId: 'tr2',
    teamId: 't8',
    playerIds: ['u10'],
    captainId: 'u10',
    submittedAt: '2026-05-15T08:50:00.000Z',
    locked: true
  },
  {
    id: 'roster9',
    tournamentId: 'tr5',
    teamId: 't3',
    playerIds: ['u3', 'u5'],
    captainId: 'u3',
    submittedAt: '2026-05-27T11:20:00.000Z',
    locked: false
  }
]
