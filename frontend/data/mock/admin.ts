import type { AdminAction } from '~/types/domain'

export const mockAdminActions: AdminAction[] = [
  {
    id: 'aa1',
    adminUserId: 'u1',
    type: 'tournament_created',
    targetType: 'tournament',
    targetId: 'tr4',
    comment: 'Подготовлен черновик Basket Night 3x3.',
    createdAt: '2026-06-05T10:00:00.000Z'
  },
  {
    id: 'aa2',
    adminUserId: 'u4',
    type: 'application_approved',
    targetType: 'application',
    targetId: 'app1',
    comment: 'Капитан подтвердил участие команды.',
    createdAt: '2026-06-03T12:10:00.000Z'
  },
  {
    id: 'aa3',
    adminUserId: 'u4',
    type: 'application_rejected',
    targetType: 'application',
    targetId: 'app4',
    comment: 'В заявке не хватает игроков.',
    createdAt: '2026-05-27T14:50:00.000Z'
  },
  {
    id: 'aa4',
    adminUserId: 'u1',
    type: 'rating_adjusted',
    targetType: 'rating',
    targetId: 'r3',
    comment: 'Начислены очки за подтверждённый матч.',
    createdAt: '2026-06-10T18:30:00.000Z'
  }
]
