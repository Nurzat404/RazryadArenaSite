import type { Tournament } from '~/types/domain'

const dateFromNow = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10)

export const mockTournaments: Tournament[] = [
  {
    id: 'tr1',
    name: 'CS2 Weekend Cup',
    sport: 'cs2',
    city: 'Онлайн',
    status: 'registration_open',
    registrationStartDate: dateFromNow(-7),
    registrationEndDate: dateFromNow(14),
    eventStartDate: dateFromNow(18),
    maxTeams: 16,
    requiredTeamSize: 5,
    description: 'CS2-турнир на выходные. Матчи проходят по сетке на выбывание.'
  },
  {
    id: 'tr2',
    name: 'Летний футбольный кубок',
    sport: 'football',
    city: 'Екатеринбург',
    status: 'active',
    registrationStartDate: dateFromNow(-30),
    registrationEndDate: dateFromNow(-10),
    eventStartDate: dateFromNow(-5),
    eventEndDate: dateFromNow(15),
    maxTeams: 8,
    requiredTeamSize: 7,
    description: 'Городской турнир для любительских команд. Матчи проходят по вечерам на одной площадке.'
  },
  {
    id: 'tr3',
    name: 'Волейбол после пар',
    sport: 'volleyball',
    city: 'Екатеринбург',
    status: 'registration_closed',
    registrationStartDate: dateFromNow(-20),
    registrationEndDate: dateFromNow(-2),
    eventStartDate: dateFromNow(5),
    eventEndDate: dateFromNow(11),
    maxTeams: 6,
    requiredTeamSize: 6,
    description: 'Короткий волейбольный турнир для студенческих и дворовых команд.'
  },
  {
    id: 'tr4',
    name: 'Basket Night 3x3',
    sport: 'basketball',
    city: 'Екатеринбург',
    status: 'draft',
    registrationStartDate: dateFromNow(20),
    registrationEndDate: dateFromNow(34),
    eventStartDate: dateFromNow(40),
    maxTeams: 12,
    requiredTeamSize: 3,
    description: 'Вечерний баскетбол 3x3. Турнир пока готовится, заявки откроются позже.'
  }
]
