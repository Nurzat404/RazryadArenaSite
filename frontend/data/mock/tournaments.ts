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
    requiredTeamSize: 2,
    minAge: 16,
    maxAge: 30,
    matchFormat: 'Олимпийская сетка, матчи BO1',
    scheduleMode: 'fixed',
    location: 'Онлайн',
    rules: [
      'В составе должно быть ровно два игрока.',
      'Один игрок не может выступать за две команды в одном турнире.',
      'Капитан отвечает за готовность команды к назначенному времени.'
    ],
    mapPool: ['Mirage', 'Inferno', 'Nuke', 'Ancient', 'Anubis', 'Dust II'],
    allowRosterChanges: true,
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
    minAge: 16,
    maxAge: 35,
    matchFormat: 'Группы и плей-офф',
    scheduleMode: 'fixed',
    location: 'Стадион «Юность»',
    rules: [
      'Матчи проходят по опубликованному расписанию.',
      'На игру нужно прийти за 20 минут до начала.',
      'Замена игрока после старта турнира согласуется с организатором.'
    ],
    allowRosterChanges: false,
    description: 'Городской турнир для любительских команд. Матчи проходят по вечерам на одной площадке.'
  },
  {
    id: 'tr3',
    name: 'Волейбол после пар',
    sport: 'volleyball',
    city: 'Екатеринбург',
    status: 'active',
    registrationStartDate: dateFromNow(-20),
    registrationEndDate: dateFromNow(-2),
    eventStartDate: dateFromNow(-1),
    eventEndDate: dateFromNow(5),
    maxTeams: 6,
    requiredTeamSize: 6,
    minAge: 16,
    maxAge: 25,
    matchFormat: 'Круговой этап, затем финал',
    scheduleMode: 'sequential',
    location: 'Спортзал УрФУ',
    rules: [
      'Команда заявляет шесть основных игроков.',
      'Опоздание более чем на 15 минут может привести к техническому поражению.'
    ],
    allowRosterChanges: true,
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
    minAge: 16,
    maxAge: 30,
    matchFormat: 'Группы и плей-офф 3x3',
    scheduleMode: 'sequential',
    location: 'Площадка будет объявлена',
    rules: [
      'Подробные правила появятся до открытия регистрации.'
    ],
    allowRosterChanges: false,
    description: 'Вечерний баскетбол 3x3. Турнир пока готовится, заявки откроются позже.'
  }
]
