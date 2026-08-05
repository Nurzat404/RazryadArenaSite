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
    matchId: 'm4',
    round: 1,
    roundName: 'Полуфинал',
    position: 2,
    team1Id: 't2',
    team2Id: 't4',
    winnerId: 't2',
    nextMatchId: 'bm3',
    status: 'finished'
  },
  {
    id: 'bm3',
    tournamentId: 'tr1',
    round: 2,
    roundName: 'Финал',
    position: 1,
    team2Id: 't2',
    status: 'pending'
  },
  {
    id: 'bm4',
    tournamentId: 'tr1',
    round: 2,
    roundName: 'Матч за 3-е место',
    position: 2,
    team2Id: 't4',
    status: 'pending',
    isThirdPlace: true
  },
  {
    id: 'bm5',
    tournamentId: 'tr2',
    matchId: 'm2',
    round: 1,
    roundName: 'Группа A',
    position: 1,
    team1Id: 't2',
    team2Id: 't1',
    winnerId: 't2',
    status: 'finished'
  },
  {
    id: 'bm6',
    tournamentId: 'tr3',
    round: 1,
    roundName: 'Первый раунд',
    position: 2,
    team1Id: 't4',
    winnerId: 't4',
    status: 'finished',
    isBye: true
  }
]
