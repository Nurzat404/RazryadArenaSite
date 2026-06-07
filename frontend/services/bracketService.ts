import { mockBracketMatches } from '~/data/mock/brackets'

export const bracketService = {
  async listByTournament(tournamentId: string) {
    return mockBracketMatches
      .filter((match) => match.tournamentId === tournamentId)
      .sort((a, b) => a.round - b.round || a.position - b.position)
  },

  async getMatch(id: string) {
    return mockBracketMatches.find((match) => match.id === id) ?? null
  },

  async refresh(tournamentId: string) {
    return this.listByTournament(tournamentId)
  }
}
