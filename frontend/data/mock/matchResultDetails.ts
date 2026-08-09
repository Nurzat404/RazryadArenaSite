import type { MatchResultDetails } from '~/types/domain'

export const mockMatchResultDetails: MatchResultDetails[] = [
  {
    matchId: 'm4',
    team1Id: 't5',
    team2Id: 't7',
    participantUserIds: ['u7', 'u8', 'u9'],
    mapResults: [
      { mapName: 'Mirage', score1: 13, score2: 9 },
      { mapName: 'Nuke', score1: 13, score2: 11 }
    ],
    volleyballSets: [],
    playerStats: [
      { userId: 'u7', kills: 42, deaths: 28, assists: 11, adr: 91.6, headshotPercent: 48, playerRating: 1.31 },
      { userId: 'u8', kills: 35, deaths: 31, assists: 14, adr: 79.4, headshotPercent: 39, playerRating: 1.12 },
      { userId: 'u9', kills: 31, deaths: 39, assists: 9, adr: 72.8, headshotPercent: 44, playerRating: 0.94 }
    ],
    mvpUserId: 'u7',
    updatedAt: '2026-08-07T18:44:00.000Z'
  },
  {
    matchId: 'm2',
    team1Id: 't2',
    team2Id: 't8',
    participantUserIds: ['u1', 'u10'],
    mapResults: [],
    volleyballSets: [],
    playerStats: [
      { userId: 'u1', goals: 2, assists: 1 },
      { userId: 'u10', goals: 1, assists: 0 }
    ],
    mvpUserId: 'u1',
    updatedAt: '2026-08-05T17:10:00.000Z'
  }
]
