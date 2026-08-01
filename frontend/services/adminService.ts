import { mockAdminActions } from '~/data/mock/admin'
import { mockTournaments } from '~/data/mock/tournaments'
import { useMockTeams, useMockUsers } from '~/data/mock/state'

export const adminService = {
  async dashboard() {
    return {
      usersCount: useMockUsers().value.length,
      teamsCount: useMockTeams().value.length,
      tournamentsCount: mockTournaments.length,
      latestActions: mockAdminActions.slice(0, 5)
    }
  },

  async listActions() {
    return [...mockAdminActions].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async getActionById(id: string) {
    return mockAdminActions.find((action) => action.id === id) ?? null
  }
}
