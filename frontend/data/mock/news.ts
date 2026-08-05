import type { SiteNews } from '~/types/domain'

const dateTimeFromNow = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString()

export const mockNews: SiteNews[] = [
  {
    id: 'news1',
    title: 'Открыты заявки на CS2 Weekend Cup',
    body: 'Заявку отправляет капитан. Перед отправкой проверьте состав команды.',
    type: 'tournament',
    publishedAt: dateTimeFromNow(-2),
    actionUrl: '/tournaments'
  },
  {
    id: 'news2',
    title: 'Расписание матчей теперь видно из профиля',
    body: 'Если команда участвует в турнире, в профиле видны ближайшая игра, соперник и время.',
    type: 'update',
    publishedAt: dateTimeFromNow(-4),
    actionUrl: '/profile'
  },
  {
    id: 'news3',
    title: 'Матчи футбольного кубка проходят вечером',
    body: 'Время и место каждой игры опубликованы в расписании. После матча там же появится счёт.',
    type: 'announcement',
    publishedAt: dateTimeFromNow(-6),
    actionUrl: '/tournaments/tr1/bracket'
  }
]
