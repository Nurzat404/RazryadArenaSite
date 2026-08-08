import { useMockMatches, useMockMatchResultDetails, useMockPlayerStats, useMockTournamentRosters } from '~/data/mock/state'
import type { PlayerStats, SportKey } from '~/types/domain'

export const statsService = {
  async list(filters: { userId?: string; sport?: SportKey } = {}) {
    const rows = useMockPlayerStats().value.map((row) => ({ ...row }))
    const matches = useMockMatches().value
    const rosters = useMockTournamentRosters().value

    useMockMatchResultDetails().value.forEach((details) => {
      const match = matches.find((item) => item.id === details.matchId)
      if (!match?.winnerId) return
      details.playerStats.forEach((stat) => {
        let row = rows.find((item) => item.userId === stat.userId && item.sport === match.sport)
        if (!row) {
          row = { id: `stats-${stat.userId}-${match.sport}`, userId: stat.userId, sport: match.sport, matchesPlayed: 0, wins: 0, losses: 0, rating: 0 }
          rows.push(row)
        }
        const roster = rosters.find((item) => item.tournamentId === match.tournamentId && item.playerIds.includes(stat.userId))
        const won = roster?.teamId === match.winnerId
        row.matchesPlayed += 1
        row.wins += won ? 1 : 0
        row.losses += won ? 0 : 1
        row.rating += won ? 2 : 0
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
        if (stat.adr !== undefined) row.cs2Adr = stat.adr
        if (stat.headshotPercent !== undefined) row.cs2HeadshotPercent = stat.headshotPercent
        if (stat.playerRating !== undefined) row.rating = stat.playerRating
      })
    })

    return rows
      .filter((stats) => (filters.userId ? stats.userId === filters.userId : true))
      .filter((stats) => (filters.sport ? stats.sport === filters.sport : true))
  },

  async getByUserAndSport(userId: string, sport: SportKey) {
    return (await this.list({ userId, sport }))[0] as PlayerStats | undefined ?? null
  }
}
