import {
  useMockMatches,
  useMockMatchResultDetails,
  useMockPlayerStats,
  useMockTeams,
  useMockTournamentRosters,
  useMockTournaments
} from '~/data/mock/state'
import type { Match, PlayerMatchStat, PlayerStats, SportKey } from '~/types/domain'

export type PlayerMatchOutcome = 'upcoming' | 'live' | 'win' | 'loss' | 'draw'

export interface PlayerMatchHistoryItem {
  match: Match
  tournamentName: string
  teamId: string
  teamName: string
  opponentId: string
  opponentName: string
  outcome: PlayerMatchOutcome
  scoreFor?: number
  scoreAgainst?: number
  playerStat?: PlayerMatchStat
  isMvp: boolean
}

export interface PlayerRatingTrendPoint {
  matchId: string
  label: string
  value: number
  outcome: Exclude<PlayerMatchOutcome, 'upcoming' | 'live'>
}

const rounded = (value: number, digits = 1) => Number(value.toFixed(digits))

const updateAverage = (current: number | undefined, next: number, previousMatches: number) =>
  rounded((((current ?? next) * previousMatches) + next) / (previousMatches + 1), 2)

const playerTeamForMatch = (userId: string, match: Match) => useMockTournamentRosters().value.find((roster) => (
  roster.tournamentId === match.tournamentId
  && roster.playerIds.includes(userId)
  && [match.team1Id, match.team2Id].includes(roster.teamId)
))?.teamId

export const statsService = {
  async list(filters: { userId?: string; sport?: SportKey } = {}) {
    const rows = useMockPlayerStats().value.map((row) => ({ ...row }))
    const matches = useMockMatches().value

    useMockMatchResultDetails().value.forEach((details) => {
      const match = matches.find((item) => item.id === details.matchId)
      if (!match?.winnerId) return

      details.playerStats.forEach((stat) => {
        let row = rows.find((item) => item.userId === stat.userId && item.sport === match.sport)
        if (!row) {
          row = {
            id: `stats-${stat.userId}-${match.sport}`,
            userId: stat.userId,
            sport: match.sport,
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
            rating: 0
          }
          rows.push(row)
        }

        const previousMatches = row.matchesPlayed
        const teamId = playerTeamForMatch(stat.userId, match)
        const won = teamId === match.winnerId
        row.matchesPlayed += 1
        row.wins += won ? 1 : 0
        row.losses += won ? 0 : 1
        row.rating += (won ? 7 : 2) + (details.mvpUserId === stat.userId ? 1 : 0)
        row.cs2Kills = (row.cs2Kills ?? 0) + (stat.kills ?? 0)
        row.cs2Deaths = (row.cs2Deaths ?? 0) + (stat.deaths ?? 0)
        row.cs2Assists = (row.cs2Assists ?? 0) + (stat.assists ?? 0)
        row.goals = (row.goals ?? 0) + (stat.goals ?? 0)
        row.assists = (row.assists ?? 0) + (stat.assists ?? 0)
        row.points = (row.points ?? 0) + (stat.points ?? 0)
        row.rebounds = (row.rebounds ?? 0) + (stat.rebounds ?? 0)
        row.setsWon = (row.setsWon ?? 0) + (stat.setsWon ?? 0)
        row.fouls = (row.fouls ?? 0) + (stat.fouls ?? 0)
        row.aces = (row.aces ?? 0) + (stat.aces ?? 0)
        if (stat.adr !== undefined) row.cs2Adr = updateAverage(row.cs2Adr, stat.adr, previousMatches)
        if (stat.headshotPercent !== undefined) row.cs2HeadshotPercent = updateAverage(row.cs2HeadshotPercent, stat.headshotPercent, previousMatches)
        if (stat.playerRating !== undefined) row.cs2PlayerRating = updateAverage(row.cs2PlayerRating, stat.playerRating, previousMatches)
        if (details.mvpUserId === stat.userId) row.mvpCount = (row.mvpCount ?? 0) + 1
      })
    })

    return rows
      .filter((stats) => (filters.userId ? stats.userId === filters.userId : true))
      .filter((stats) => (filters.sport ? stats.sport === filters.sport : true))
      .sort((a, b) => b.matchesPlayed - a.matchesPlayed)
  },

  async getByUserAndSport(userId: string, sport: SportKey) {
    return (await this.list({ userId, sport }))[0] as PlayerStats | undefined ?? null
  },

  async matchesByUser(userId: string, sport?: SportKey): Promise<PlayerMatchHistoryItem[]> {
    const matches = useMockMatches().value
    const teams = useMockTeams().value
    const tournaments = useMockTournaments().value
    const details = useMockMatchResultDetails().value
    const teamById = new Map(teams.map((team) => [team.id, team]))
    const tournamentById = new Map(tournaments.map((tournament) => [tournament.id, tournament]))

    return matches
      .filter((match) => sport ? match.sport === sport : true)
      .map((match) => ({ match, teamId: playerTeamForMatch(userId, match) }))
      .filter((entry): entry is { match: Match; teamId: string } => Boolean(entry.teamId))
      .map(({ match, teamId }) => {
        const opponentId = match.team1Id === teamId ? match.team2Id : match.team1Id
        const ownIsFirst = match.team1Id === teamId
        const result = details.find((item) => item.matchId === match.id)
        const isFinished = ['finished', 'technical_win'].includes(match.status)
        const isDraw = isFinished && match.score1 === match.score2
        const outcome: PlayerMatchOutcome = match.status === 'active'
          ? 'live'
          : !isFinished
            ? 'upcoming'
            : isDraw
              ? 'draw'
              : match.winnerId === teamId ? 'win' : 'loss'

        return {
          match,
          tournamentName: tournamentById.get(match.tournamentId)?.name ?? 'Турнир',
          teamId,
          teamName: teamById.get(teamId)?.name ?? 'Команда',
          opponentId,
          opponentName: teamById.get(opponentId)?.name ?? 'Соперник',
          outcome,
          scoreFor: ownIsFirst ? match.score1 : match.score2,
          scoreAgainst: ownIsFirst ? match.score2 : match.score1,
          playerStat: result?.playerStats.find((item) => item.userId === userId),
          isMvp: result?.mvpUserId === userId
        }
      })
      .sort((a, b) => b.match.scheduledAt.localeCompare(a.match.scheduledAt))
  },

  async ratingTrend(userId: string, sport: SportKey): Promise<PlayerRatingTrendPoint[]> {
    const statsPromise = this.getByUserAndSport(userId, sport)
    const matchesPromise = this.matchesByUser(userId, sport)
    const [stats, history] = await Promise.all([statsPromise, matchesPromise])
    const completed = history
      .filter((item) => ['win', 'loss', 'draw'].includes(item.outcome))
      .reverse()
    if (!stats || !completed.length) return []

    const deltas = completed.map((item) => (
      (item.outcome === 'win' ? 7 : item.outcome === 'draw' ? 3 : 2) + (item.isMvp ? 1 : 0)
    ))
    let value = Math.max(0, stats.rating - deltas.reduce((sum, delta) => sum + delta, 0))

    return completed.map((item, index) => {
      value += deltas[index] ?? 0
      return {
        matchId: item.match.id,
        label: new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit' }).format(new Date(item.match.scheduledAt)),
        value,
        outcome: item.outcome as Exclude<PlayerMatchOutcome, 'upcoming' | 'live'>
      }
    })
  }
}
