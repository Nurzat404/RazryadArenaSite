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
    description: 'Любительский CS2-турнир с сеткой single elimination и рейтингом команд.'
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
    description: 'Очный турнир для любительских футбольных команд города.'
  }
]
