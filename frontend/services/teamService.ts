import { mockTeams } from '~/data/mock/teams'

export const teamService = {
  async list() {
    return mockTeams
  },

  async getById(id: string) {
    return mockTeams.find((team) => team.id === id) ?? null
  }
}
