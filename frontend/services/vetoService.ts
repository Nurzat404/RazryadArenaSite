import { useMockMapVetoSessions } from '~/data/mock/state'
import type { MapVetoAction, VetoActionType } from '~/types/domain'

export const vetoService = {
  async getByMatchId(matchId: string) {
    return useMockMapVetoSessions().value.find((session) => session.matchId === matchId) ?? null
  },

  async start(matchId: string) {
    const sessions = useMockMapVetoSessions()
    const session = sessions.value.find((item) => item.matchId === matchId)
    if (!session) return null
    const updated = { ...session, status: 'active' as const }
    sessions.value = sessions.value.map((item) => item.id === session.id ? updated : item)
    return updated
  },

  async addAction(sessionId: string, teamId: string, type: VetoActionType, map: string): Promise<MapVetoAction | null> {
    const sessions = useMockMapVetoSessions()
    const session = sessions.value.find((item) => item.id === sessionId)

    if (!session) {
      return null
    }

    const action = {
      id: `mock-veto-action-${session.actions.length + 1}`,
      sessionId,
      teamId,
      type,
      map,
      createdAt: new Date().toISOString()
    }
    sessions.value = sessions.value.map((item) => item.id === sessionId ? { ...item, actions: [...item.actions, action] } : item)
    return action
  },

  async finishByMatchId(matchId: string) {
    const sessions = useMockMapVetoSessions()
    const session = sessions.value.find((item) => item.matchId === matchId && item.status !== 'finished')
    if (!session) return null
    const updated = { ...session, status: 'finished' as const, currentTeamId: undefined, deadlineAt: undefined }
    sessions.value = sessions.value.map((item) => item.id === session.id ? updated : item)
    return updated
  }
}
