import { useMockBracketMatches } from '~/data/mock/state'

export const bracketService = {
  async listByTournament(tournamentId: string) {
    return useMockBracketMatches().value
      .filter((match) => match.tournamentId === tournamentId)
      .sort((a, b) => a.round - b.round || a.position - b.position)
  },

  async getMatch(id: string) {
    return useMockBracketMatches().value.find((match) => match.id === id) ?? null
  },

  async refresh(tournamentId: string) {
    return this.listByTournament(tournamentId)
  }
}
