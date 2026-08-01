import type { Match } from '~/types/domain'

const dateTimeFromNow = (days: number, hour: number) => {
  const date = new Date(Date.now() + days * 86_400_000)
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

export const mockMatches: Match[] = [
  {
    id: 'm1',
    tournamentId: 'tr1',
    sport: 'cs2',
    team1Id: 't1',
    team2Id: 't2',
    scheduledAt: dateTimeFromNow(5, 18),
    location: 'Онлайн',
    status: 'scheduled'
  },
  {
    id: 'm2',
    tournamentId: 'tr2',
    sport: 'football',
    team1Id: 't2',
    team2Id: 't1',
    scheduledAt: dateTimeFromNow(-3, 19),
    location: 'Стадион "Юность"',
    status: 'finished',
    score1: 3,
    score2: 1,
    winnerId: 't2'
  },
  {
    id: 'm3',
    tournamentId: 'tr3',
    sport: 'volleyball',
    team1Id: 't4',
    team2Id: 't2',
    scheduledAt: dateTimeFromNow(0, 17),
    location: 'Спортзал УрФУ',
    status: 'active',
    score1: 1,
    score2: 1
  }
]
