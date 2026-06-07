import type { Notification } from '~/types/domain'

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'u2',
    type: 'tournament_application_approved',
    title: 'Заявку Arena Five приняли',
    body: 'Команда уже в списке участников CS2 Weekend Cup.',
    createdAt: '2026-06-03T12:10:00.000Z',
    actionUrl: '/tournaments/tr1'
  },
  {
    id: 'n2',
    userId: 'u3',
    type: 'match_scheduled',
    title: 'Матч назначен',
    body: 'Dust Friends сыграет с Arena Five 22 июня в 15:00.',
    createdAt: '2026-06-07T08:00:00.000Z',
    actionUrl: '/matches/m1'
  },
  {
    id: 'n3',
    userId: 'u1',
    type: 'admin_action',
    title: 'Роль обновлена',
    body: 'Теперь у вас есть доступ к админским разделам.',
    createdAt: '2026-06-01T07:30:00.000Z',
    readAt: '2026-06-01T08:05:00.000Z',
    actionUrl: '/admin'
  },
  {
    id: 'n4',
    userId: 'u6',
    type: 'tournament_application_rejected',
    title: 'Заявку нужно поправить',
    body: 'В составе Северного блока пока не хватает игроков.',
    createdAt: '2026-05-27T14:50:00.000Z',
    actionUrl: '/profile/tournaments'
  }
]
