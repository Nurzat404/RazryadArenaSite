import { mockReferralAttributions, mockReferralLinks } from '~/data/mock/referrals'
import type { ReferralLink, SportKey } from '~/types/domain'

export interface ReferralLinkPayload {
  ownerUserId: string
  title: string
  sport?: SportKey
}

export const referralService = {
  async listByOwner(ownerUserId: string) {
    return mockReferralLinks.filter((link) => link.ownerUserId === ownerUserId)
  },

  async getById(id: string) {
    return mockReferralLinks.find((link) => link.id === id) ?? null
  },

  async listAttributions(linkId: string) {
    return mockReferralAttributions.filter((attribution) => attribution.linkId === linkId)
  },

  async create(payload: ReferralLinkPayload): Promise<ReferralLink> {
    return {
      id: 'mock-new-referral',
      ownerUserId: payload.ownerUserId,
      title: payload.title,
      sport: payload.sport,
      code: 'NEW-MOCK-LINK',
      status: 'active',
      createdAt: new Date().toISOString(),
      invitedUsersCount: 0,
      approvedApplicationsCount: 0,
      firstMatchesCount: 0,
      points: 0
    }
  },

  async disable(id: string) {
    const link = mockReferralLinks.find((item) => item.id === id)
    return link ? { ...link, status: 'disabled' as const } : null
  }
}
