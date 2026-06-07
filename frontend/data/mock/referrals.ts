import type { ReferralAttribution, ReferralLink } from '~/types/domain'

export const mockReferralLinks: ReferralLink[] = [
  {
    id: 'ref1',
    ownerUserId: 'u1',
    title: 'CS2 друзья из универа',
    sport: 'cs2',
    code: 'CS2-URAL-2026',
    status: 'active',
    createdAt: '2026-06-01T09:00:00.000Z',
    invitedUsersCount: 4,
    approvedApplicationsCount: 2,
    firstMatchesCount: 1,
    points: 35
  },
  {
    id: 'ref2',
    ownerUserId: 'u4',
    title: 'Футбольные команды района',
    sport: 'football',
    code: 'FOOTBALL-YARD',
    status: 'active',
    createdAt: '2026-05-20T12:30:00.000Z',
    invitedUsersCount: 7,
    approvedApplicationsCount: 3,
    firstMatchesCount: 2,
    points: 60
  }
]

export const mockReferralAttributions: ReferralAttribution[] = [
  {
    id: 'attr1',
    linkId: 'ref1',
    invitedUserId: 'u5',
    createdAt: '2026-06-02T13:10:00.000Z'
  },
  {
    id: 'attr2',
    linkId: 'ref2',
    invitedUserId: 'u6',
    createdAt: '2026-05-22T17:40:00.000Z',
    firstMatchAt: '2026-06-12T14:30:00.000Z'
  }
]
