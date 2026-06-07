import type { MapVetoSession } from '~/types/domain'

export const mockMapVetoSessions: MapVetoSession[] = [
  {
    id: 'veto1',
    matchId: 'm1',
    status: 'pending',
    format: 'bo3',
    mapPool: ['Ancient', 'Anubis', 'Dust2', 'Inferno', 'Mirage', 'Nuke', 'Train'],
    currentTeamId: 't1',
    deadlineAt: '2026-06-22T14:55:00.000Z',
    finalMaps: [],
    actions: []
  },
  {
    id: 'veto2',
    matchId: 'm2',
    status: 'finished',
    format: 'bo1',
    mapPool: ['Ancient', 'Anubis', 'Dust2', 'Inferno', 'Mirage', 'Nuke', 'Train'],
    finalMaps: ['Mirage'],
    actions: [
      {
        id: 'veto-action-1',
        sessionId: 'veto2',
        teamId: 't2',
        type: 'ban',
        map: 'Nuke',
        createdAt: '2026-06-10T15:20:00.000Z'
      },
      {
        id: 'veto-action-2',
        sessionId: 'veto2',
        teamId: 't1',
        type: 'decider',
        map: 'Mirage',
        createdAt: '2026-06-10T15:24:00.000Z'
      }
    ]
  }
]
