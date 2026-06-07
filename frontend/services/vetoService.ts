import { mockMapVetoSessions } from '~/data/mock/mapVeto'
import type { MapVetoAction, VetoActionType } from '~/types/domain'

export const vetoService = {
  async getByMatchId(matchId: string) {
    return mockMapVetoSessions.find((session) => session.matchId === matchId) ?? null
  },

  async start(matchId: string) {
    const session = mockMapVetoSessions.find((item) => item.matchId === matchId)
    return session ? { ...session, status: 'active' as const } : null
  },

  async addAction(sessionId: string, teamId: string, type: VetoActionType, map: string): Promise<MapVetoAction | null> {
    const session = mockMapVetoSessions.find((item) => item.id === sessionId)

    if (!session) {
      return null
    }

    return {
      id: `mock-veto-action-${session.actions.length + 1}`,
      sessionId,
      teamId,
      type,
      map,
      createdAt: new Date().toISOString()
    }
  }
}
