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
    nextMatchSlot: 1,
    thirdPlaceMatchId: 'bm4',
    thirdPlaceSlot: 1,
    status: 'scheduled'
  },
  {
    id: 'bm2',
    tournamentId: 'tr1',
    matchId: 'm4',
    round: 1,
    roundName: 'Полуфинал',
    position: 2,
    team1Id: 't5',
    team2Id: 't7',
    winnerId: 't5',
    nextMatchId: 'bm3',
    nextMatchSlot: 2,
    thirdPlaceMatchId: 'bm4',
    thirdPlaceSlot: 2,
    status: 'finished'
  },
  {
    id: 'bm3',
    tournamentId: 'tr1',
    round: 2,
    roundName: 'Финал',
    position: 1,
    team2Id: 't5',
    status: 'pending'
  },
  {
    id: 'bm4',
    tournamentId: 'tr1',
    round: 2,
    roundName: 'Матч за 3-е место',
    position: 2,
    team2Id: 't7',
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
    team2Id: 't8',
    winnerId: 't2',
    status: 'finished'
  },
  {
    id: 'bm6',
    tournamentId: 'tr3',
    matchId: 'm3',
    round: 1,
    roundName: 'Первый раунд',
    position: 2,
    team1Id: 't4',
    team2Id: 't6',
    status: 'scheduled'
  }
]
