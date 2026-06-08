import type { SiteNews } from '~/types/domain'

export const mockNews: SiteNews[] = [
  {
    id: 'news1',
    title: 'Заявки на CS2 Weekend Cup открыты до 20 июня',
    body: 'Капитан может подать команду сейчас, а состав спокойно проверить перед стартом.',
    type: 'tournament',
    publishedAt: '2026-06-08T09:00:00.000Z',
    actionUrl: '/tournaments'
  },
  {
    id: 'news2',
    title: 'Расписание матчей теперь видно из профиля',
    body: 'Если команда уже в турнире, ближайшая игра не потеряется в переписке.',
    type: 'update',
    publishedAt: '2026-06-06T12:30:00.000Z',
    actionUrl: '/profile'
  },
  {
    id: 'news3',
    title: 'Футбольный кубок идет по вечернему расписанию',
    body: 'Результаты появляются после игры, а спорные моменты остаются у организатора.',
    type: 'announcement',
    publishedAt: '2026-06-04T17:20:00.000Z',
    actionUrl: '/matches'
  }
]
