import type { BracketMatch, Match, TournamentApplication, TournamentRoster } from '../types/domain'

export const findTournamentDataIssues = (
  applications: TournamentApplication[],
  rosters: TournamentRoster[],
  brackets: BracketMatch[],
  matches: Match[]
) => {
  const issues: string[] = []
  const approvedKeys = new Set(applications
    .filter((application) => application.status === 'approved')
    .map((application) => `${application.tournamentId}:${application.teamId}`))
  const rosterKeys = new Set(rosters.map((roster) => `${roster.tournamentId}:${roster.teamId}`))
  const matchIds = new Set(matches.map((match) => match.id))

  applications.filter((application) => application.status === 'approved').forEach((application) => {
    const key = `${application.tournamentId}:${application.teamId}`
    if (!rosterKeys.has(key)) issues.push(`У одобренной команды ${key} нет турнирного состава.`)
  })

  brackets.forEach((bracket) => {
    if (bracket.matchId && !matchIds.has(bracket.matchId)) issues.push(`Ячейка ${bracket.id} ссылается на отсутствующий матч.`)
    ;[bracket.team1Id, bracket.team2Id].filter(Boolean).forEach((teamId) => {
      const key = `${bracket.tournamentId}:${teamId}`
      if (!approvedKeys.has(key)) issues.push(`Команда ${key} есть в сетке без одобренной заявки.`)
    })
  })

  matches.forEach((match) => {
    ;[match.team1Id, match.team2Id].forEach((teamId) => {
      const key = `${match.tournamentId}:${teamId}`
      if (!approvedKeys.has(key)) issues.push(`Команда ${key} есть в матче без одобренной заявки.`)
    })
  })

  return [...new Set(issues)]
}
