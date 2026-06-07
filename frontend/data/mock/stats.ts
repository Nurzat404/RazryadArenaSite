import type { PlayerStats } from '~/types/domain'

export const mockPlayerStats: PlayerStats[] = [
  {
    id: 'stats1',
    userId: 'u1',
    sport: 'cs2',
    matchesPlayed: 8,
    wins: 5,
    losses: 3,
    rating: 121,
    cs2Kills: 146,
    cs2Deaths: 118,
    cs2Assists: 42,
    cs2Adr: 78.4,
    cs2HeadshotPercent: 41
  },
  {
    id: 'stats2',
    userId: 'u3',
    sport: 'cs2',
    matchesPlayed: 6,
    wins: 4,
    losses: 2,
    rating: 127,
    cs2Kills: 132,
    cs2Deaths: 91,
    cs2Assists: 36,
    cs2Adr: 84.1,
    cs2HeadshotPercent: 47
  },
  {
    id: 'stats3',
    userId: 'u1',
    sport: 'football',
    matchesPlayed: 4,
    wins: 3,
    losses: 1,
    rating: 118,
    goals: 5,
    assists: 2
  },
  {
    id: 'stats4',
    userId: 'u6',
    sport: 'volleyball',
    matchesPlayed: 3,
    wins: 1,
    losses: 2,
    rating: 96,
    setsWon: 4
  }
]
