import type { Tournament } from '~/types/domain'

export const mockTournaments: Tournament[] = [
  {
    id: 'tr1',
    name: 'CS2 Weekend Cup',
    sport: 'cs2',
    city: 'Онлайн',
    status: 'registration_open',
    registrationStartDate: '2026-06-01',
    registrationEndDate: '2026-06-20',
    eventStartDate: '2026-06-22',
    maxTeams: 16,
    requiredTeamSize: 5,
    description: 'CS2-турнир на выходные: собрали состав, подали заявку, играете по сетке single elimination.'
  },
  {
    id: 'tr2',
    name: 'Летний футбольный кубок',
    sport: 'football',
    city: 'Екатеринбург',
    status: 'active',
    registrationStartDate: '2026-05-10',
    registrationEndDate: '2026-05-28',
    eventStartDate: '2026-06-02',
    eventEndDate: '2026-06-30',
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
    registrationStartDate: '2026-05-20',
    registrationEndDate: '2026-06-05',
    eventStartDate: '2026-06-12',
    eventEndDate: '2026-06-18',
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
    registrationStartDate: '2026-07-01',
    registrationEndDate: '2026-07-14',
    eventStartDate: '2026-07-18',
    maxTeams: 12,
    requiredTeamSize: 3,
    description: 'Вечерний баскетбол 3x3. Турнир пока готовится, заявки откроются позже.'
  }
]
