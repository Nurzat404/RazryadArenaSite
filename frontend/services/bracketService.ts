import { useMockBracketMatches } from '~/data/mock/state'
import { progressBracket } from '~/utils/bracketProgression'
import { matchService } from './matchService'

const resolveByes = async (tournamentId: string) => {
  const brackets = useMockBracketMatches()
  const readyIds = new Set<string>()
  let changed = true

  while (changed) {
    changed = false
    const bye = brackets.value.find((match) => (
      match.tournamentId === tournamentId
      && match.isBye
      && match.status !== 'finished'
      && Boolean(match.team1Id || match.team2Id)
      && !(match.team1Id && match.team2Id)
    ))
    if (!bye) break
    const winnerId = bye.team1Id ?? bye.team2Id
    if (!winnerId) break
    const progression = progressBracket(brackets.value, bye.id, winnerId)
    brackets.value = progression.matches
    progression.readyMatchIds.forEach((id) => readyIds.add(id))
    changed = true
  }

  for (const bracketId of readyIds) {
    const bracket = brackets.value.find((item) => item.id === bracketId)
    if (!bracket) continue
    const match = await matchService.createForBracket(bracket)
    if (match) brackets.value = brackets.value.map((item) => item.id === bracket.id ? { ...item, matchId: match.id } : item)
  }
}

export const bracketService = {
  async listByTournament(tournamentId: string) {
    const brackets = useMockBracketMatches()
    await resolveByes(tournamentId)
    return brackets.value
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
