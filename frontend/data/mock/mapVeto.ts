import type { MapVetoSession } from '~/types/domain'

export const mockMapVetoSessions: MapVetoSession[] = [
  {
    id: 'veto1',
    matchId: 'm1',
    team1Id: 't1',
    team2Id: 't3',
    status: 'pending',
    format: 'bo3',
    mapPool: ['Ancient', 'Anubis', 'Dust2', 'Inferno', 'Mirage', 'Nuke', 'Train'],
    finalMaps: [],
    actions: []
  }
]
