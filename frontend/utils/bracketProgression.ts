import type { BracketMatch } from '../types/domain'

export interface BracketProgressionResult {
  matches: BracketMatch[]
  readyMatchIds: string[]
}

const placeTeam = (match: BracketMatch, slot: 1 | 2, teamId: string): BracketMatch => ({
  ...match,
  [slot === 1 ? 'team1Id' : 'team2Id']: teamId
})

export const progressBracket = (
  matches: BracketMatch[],
  sourceMatchId: string,
  winnerId: string
): BracketProgressionResult => {
  const source = matches.find((match) => match.matchId === sourceMatchId || match.id === sourceMatchId)
  if (!source || ![source.team1Id, source.team2Id].includes(winnerId)) {
    return { matches, readyMatchIds: [] }
  }

  const loserId = source.team1Id === winnerId ? source.team2Id : source.team1Id
  const previouslyReady = new Set(matches
    .filter((match) => match.team1Id && match.team2Id && match.status !== 'pending')
    .map((match) => match.id))

  const updated = matches.map((match) => {
    if (match.id === source.id) return { ...match, winnerId, status: 'finished' as const }

    if (source.nextMatchId === match.id && source.nextMatchSlot) {
      return placeTeam(match, source.nextMatchSlot, winnerId)
    }

    if (source.thirdPlaceMatchId === match.id && source.thirdPlaceSlot && loserId) {
      return placeTeam(match, source.thirdPlaceSlot, loserId)
    }

    return match
  }).map((match) => match.team1Id && match.team2Id && match.status === 'pending'
    ? { ...match, status: 'scheduled' as const }
    : match)

  const readyMatchIds = updated
    .filter((match) => match.team1Id && match.team2Id && match.status === 'scheduled' && !previouslyReady.has(match.id))
    .map((match) => match.id)

  return { matches: updated, readyMatchIds }
}
