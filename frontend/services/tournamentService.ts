import { mockTournaments } from '~/data/mock/tournaments'

export const tournamentService = {
  async list() {
    return mockTournaments
  },

  async getById(id: string) {
    return mockTournaments.find((tournament) => tournament.id === id) ?? null
  }
}
