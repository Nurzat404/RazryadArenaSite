import type { Match } from '~/types/domain'

export const mockMatches: Match[] = [
  {
    id: 'm1',
    tournamentId: 'tr1',
    sport: 'cs2',
    team1Id: 't1',
    team2Id: 't2',
    scheduledAt: '2026-06-22T15:00:00.000Z',
    location: 'Онлайн',
    status: 'scheduled'
  },
  {
    id: 'm2',
    tournamentId: 'tr2',
    sport: 'football',
    team1Id: 't2',
    team2Id: 't1',
    scheduledAt: '2026-06-10T16:00:00.000Z',
    location: 'Стадион "Юность"',
    status: 'finished',
    score1: 3,
    score2: 1,
    winnerId: 't2'
  },
  {
    id: 'm3',
    tournamentId: 'tr3',
    sport: 'volleyball',
    team1Id: 't4',
    team2Id: 't2',
    scheduledAt: '2026-06-12T14:30:00.000Z',
    location: 'Спортзал УрФУ',
    status: 'active',
    score1: 1,
    score2: 1
  }
]
