import {
  useMockBracketMatches,
  useMockMatchResultDetails,
  useMockMatchResultRevisions,
  useMockMatches,
  useMockTeams,
  useMockTournamentRosters,
  useMockTournaments
} from '~/data/mock/state'
import { progressBracket } from '~/utils/bracketProgression'
import { validateMapSeries, validateVolleyballSets } from '~/utils/matchResultValidation'
import { matchService } from './matchService'
import { notificationService } from './notificationService'
import { ratingService } from './ratingService'
import { referralService } from './referralService'
import { vetoService } from './vetoService'
import type { BracketMatch, Match, MatchMapResult, MatchResultDetails, PlayerMatchStat, VolleyballSetScore } from '~/types/domain'

export interface SubmitMatchResultPayload {
  score1: number
  score2: number
  winnerId: string
  technicalReason?: string
  mapResults?: MatchMapResult[]
  volleyballSets?: VolleyballSetScore[]
  playerStats?: PlayerMatchStat[]
  mvpUserId?: string
}

const playerIdsForTeam = (match: Match, teamId: string) => {
  const roster = useMockTournamentRosters().value.find((item) => item.tournamentId === match.tournamentId && item.teamId === teamId)
  if (roster) return roster.playerIds
  return useMockTeams().value.find((team) => team.id === teamId)?.memberIds ?? []
}

const notifyNextOpponents = async (bracketMatch: BracketMatch, match: Match) => {
  if (!bracketMatch.team1Id || !bracketMatch.team2Id) return
  const recipientIds = [...new Set([
    ...playerIdsForTeam(match, bracketMatch.team1Id),
    ...playerIdsForTeam(match, bracketMatch.team2Id)
  ])]
  const notificationIds = recipientIds.map((userId) => `notification-next-${bracketMatch.id}-${bracketMatch.team1Id}-${bracketMatch.team2Id}-${userId}`)
  await notificationService.removeByPrefixExcept(`notification-next-${bracketMatch.id}-`, notificationIds)

  await Promise.all(recipientIds.map((userId) => notificationService.createOnce(
    `next-${bracketMatch.id}-${bracketMatch.team1Id}-${bracketMatch.team2Id}-${userId}`,
    {
      userId,
      type: 'next_opponent_determined',
      title: 'Следующий соперник определён',
      body: 'Пара появилась в сетке. Проверьте время следующего матча.',
      actionUrl: `/tournaments/${match.tournamentId}/bracket`
    }
  )))
}

const assertResultCanBeChanged = (match: Match) => {
  if (!['finished', 'technical_win'].includes(match.status)) return
  const brackets = useMockBracketMatches().value
  const source = brackets.find((item) => item.matchId === match.id)
  if (!source) return
  const dependentBracketIds = [source.nextMatchId, source.thirdPlaceMatchId].filter(Boolean)
  const dependentMatchIds = brackets
    .filter((item) => dependentBracketIds.includes(item.id))
    .map((item) => item.matchId)
    .filter(Boolean)
  const locked = useMockMatches().value.some((item) => dependentMatchIds.includes(item.id) && ['active', 'finished', 'technical_win'].includes(item.status))
  if (locked) throw new Error('Результат нельзя изменить: следующий зависимый матч уже начался или завершён.')
}

const syncDependentMatches = (brackets: BracketMatch[]) => {
  const matches = useMockMatches()
  const bracketByMatchId = new Map(brackets.filter((item) => item.matchId).map((item) => [item.matchId!, item]))
  matches.value = matches.value.map((match) => {
    const bracket = bracketByMatchId.get(match.id)
    if (!bracket?.team1Id || !bracket.team2Id) return match
    return { ...match, team1Id: bracket.team1Id, team2Id: bracket.team2Id }
  })
}

const createReadyMatches = async (readyMatchIds: string[], sourceMatch: Match) => {
  const brackets = useMockBracketMatches()
  for (const bracketId of readyMatchIds) {
    const bracketMatch = brackets.value.find((item) => item.id === bracketId)
    if (!bracketMatch) continue
    const nextMatch = await matchService.createForBracket(bracketMatch)
    if (!nextMatch) continue
    brackets.value = brackets.value.map((item) => item.id === bracketId ? { ...item, matchId: nextMatch.id } : item)
    await notifyNextOpponents({ ...bracketMatch, matchId: nextMatch.id }, sourceMatch)
  }
}

const validatePayload = (match: Match, payload: SubmitMatchResultPayload) => {
  if (![match.team1Id, match.team2Id].includes(payload.winnerId)) return 'Выберите команду из этого матча.'
  if (![payload.score1, payload.score2].every((score) => Number.isInteger(score) && score >= 0)) return 'Счёт должен состоять из целых неотрицательных чисел.'
  if (!payload.technicalReason && (payload.score1 === payload.score2 || (payload.score1 > payload.score2 ? match.team1Id : match.team2Id) !== payload.winnerId)) {
    return 'Победитель не совпадает с итоговым счётом.'
  }

  const tournament = useMockTournaments().value.find((item) => item.id === match.tournamentId)
  if (!tournament || payload.technicalReason) return null
  if (match.sport === 'cs2') {
    const bestOf = Number(tournament.matchFormat.match(/BO([135])/i)?.[1] ?? 1)
    return validateMapSeries(payload.mapResults ?? [], bestOf, payload.score1, payload.score2)
  }
  if (match.sport === 'volleyball') return validateVolleyballSets(payload.volleyballSets ?? [], payload.score1, payload.score2)
  return null
}

const recordConsequences = async (match: Match, payload: SubmitMatchResultPayload) => {
  const loserTeamId = match.team1Id === payload.winnerId ? match.team2Id : match.team1Id
  const winnerPlayerIds = playerIdsForTeam(match, payload.winnerId)
  const loserPlayerIds = playerIdsForTeam(match, loserTeamId)
  const participantIds = [...new Set([...winnerPlayerIds, ...loserPlayerIds])]
  const now = new Date().toISOString()

  await ratingService.recordMatch({
    id: `rating-match-${match.id}`,
    matchId: match.id,
    tournamentId: match.tournamentId,
    sport: match.sport,
    winnerTeamId: payload.winnerId,
    loserTeamId,
    winnerPlayerIds,
    loserPlayerIds,
    createdAt: now
  })
  await referralService.recordFirstMatch(participantIds, now)
  await Promise.all(participantIds.map((userId) => notificationService.createOnce(
    `result-${match.id}-${userId}`,
    {
      userId,
      type: 'result_updated',
      title: 'Результат матча опубликован',
      body: `Итоговый счёт: ${payload.score1}:${payload.score2}.`,
      actionUrl: `/matches/${match.id}`
    }
  )))
}

export const matchResultService = {
  async getByMatchId(matchId: string) {
    return useMockMatchResultDetails().value.find((item) => item.matchId === matchId) ?? null
  },

  async listRevisions(matchId: string) {
    return useMockMatchResultRevisions().value
      .filter((revision) => revision.matchId === matchId)
      .sort((a, b) => b.changedAt.localeCompare(a.changedAt))
  },

  async submit(matchId: string, payload: SubmitMatchResultPayload, changedByUserId = 'system') {
    const currentMatch = await matchService.getById(matchId)
    if (!currentMatch) return null
    assertResultCanBeChanged(currentMatch)
    const validationError = validatePayload(currentMatch, payload)
    if (validationError) throw new Error(validationError)

    const previousDetails = await this.getByMatchId(matchId)
    const revisions = useMockMatchResultRevisions()
    revisions.value = [{
      id: `revision-${matchId}-${Date.now()}`,
      matchId,
      changedByUserId,
      changedAt: new Date().toISOString(),
      reason: previousDetails ? 'updated' : 'created',
      previousMatch: {
        score1: currentMatch.score1,
        score2: currentMatch.score2,
        winnerId: currentMatch.winnerId,
        status: currentMatch.status
      },
      previousDetails: previousDetails ? JSON.parse(JSON.stringify(previousDetails)) : undefined
    }, ...revisions.value]

    const status = payload.technicalReason ? 'technical_win' as const : 'finished' as const
    const match = await matchService.submitResult(matchId, {
      score1: payload.score1,
      score2: payload.score2,
      winnerId: payload.winnerId,
      status
    })
    if (!match) return null

    const details: MatchResultDetails = {
      matchId,
      team1Id: currentMatch.team1Id,
      team2Id: currentMatch.team2Id,
      participantUserIds: [...new Set([
        ...playerIdsForTeam(currentMatch, currentMatch.team1Id),
        ...playerIdsForTeam(currentMatch, currentMatch.team2Id)
      ])],
      technicalReason: payload.technicalReason,
      mapResults: (payload.mapResults ?? []).filter((item) => item.score1 > 0 || item.score2 > 0),
      volleyballSets: (payload.volleyballSets ?? []).filter((item) => item.score1 > 0 || item.score2 > 0),
      playerStats: payload.playerStats ?? [],
      mvpUserId: payload.mvpUserId,
      updatedAt: new Date().toISOString()
    }
    const allDetails = useMockMatchResultDetails()
    allDetails.value = [...allDetails.value.filter((item) => item.matchId !== matchId), details]
    if (payload.technicalReason) await vetoService.finishByMatchId(matchId)

    const brackets = useMockBracketMatches()
    const progression = progressBracket(brackets.value, match.id, payload.winnerId)
    brackets.value = progression.matches
    syncDependentMatches(progression.matches)
    await createReadyMatches(progression.readyMatchIds, match)
    await matchService.syncSequentialQueue(match.tournamentId)
    await recordConsequences(match, payload)
    return match
  }
}
