import type { BracketMatch } from '~/types/domain'

export const mockBracketMatches: BracketMatch[] = [
  {
    id: 'bm1',
    tournamentId: 'tr1',
    matchId: 'm1',
    round: 1,
    roundName: 'Полуфинал',
    position: 1,
    team1Id: 't1',
    team2Id: 't3',
    nextMatchId: 'bm3',
    status: 'scheduled'
  },
  {
    id: 'bm2',
    tournamentId: 'tr1',
    round: 1,
    roundName: 'Полуфинал',
    position: 2,
    team1Id: 't2',
    status: 'pending'
  },
  {
    id: 'bm3',
    tournamentId: 'tr1',
    round: 2,
    roundName: 'Финал',
    position: 1,
    status: 'pending'
  },
  {
    id: 'bm4',
    tournamentId: 'tr2',
    matchId: 'm2',
    round: 1,
    roundName: 'Группа A',
    position: 1,
    team1Id: 't2',
    team2Id: 't1',
    winnerId: 't2',
    status: 'finished'
  }
]
