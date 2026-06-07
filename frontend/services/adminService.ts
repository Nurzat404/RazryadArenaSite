import { mockAdminActions } from '~/data/mock/admin'
import { mockTeams } from '~/data/mock/teams'
import { mockTournaments } from '~/data/mock/tournaments'
import { mockUsers } from '~/data/mock/users'

export const adminService = {
  async dashboard() {
    return {
      usersCount: mockUsers.length,
      teamsCount: mockTeams.length,
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
