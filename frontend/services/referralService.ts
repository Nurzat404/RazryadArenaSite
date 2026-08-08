import { useMockReferralAttributions, useMockReferralLinks } from '~/data/mock/state'
import type { ReferralLink, SportKey } from '~/types/domain'

export interface ReferralLinkPayload {
  ownerUserId: string
  title: string
  sport?: SportKey
}

export const referralService = {
  async listByOwner(ownerUserId: string) {
    return useMockReferralLinks().value.filter((link) => link.ownerUserId === ownerUserId)
  },

  async getById(id: string) {
    return useMockReferralLinks().value.find((link) => link.id === id) ?? null
  },

  async listAttributions(linkId: string) {
    return useMockReferralAttributions().value.filter((attribution) => attribution.linkId === linkId)
  },

  async create(payload: ReferralLinkPayload): Promise<ReferralLink> {
    const links = useMockReferralLinks()
    const link: ReferralLink = {
      id: `referral-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ownerUserId: payload.ownerUserId,
      title: payload.title,
      sport: payload.sport,
      code: `RA-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      invitedUsersCount: 0,
      approvedApplicationsCount: 0,
      firstMatchesCount: 0,
      points: 0
    }
    links.value = [link, ...links.value]
    return link
  },

  async disable(id: string) {
    const links = useMockReferralLinks()
    const link = links.value.find((item) => item.id === id)
    if (!link) return null
    const updated = { ...link, status: 'disabled' as const }
    links.value = links.value.map((item) => item.id === id ? updated : item)
    return updated
  },

  async recordFirstMatch(userIds: string[], playedAt: string) {
    const attributions = useMockReferralAttributions()
    const links = useMockReferralLinks()
    const newlyCompleted = attributions.value.filter((item) => userIds.includes(item.invitedUserId) && !item.firstMatchAt)
    if (!newlyCompleted.length) return 0

    const linkIds = newlyCompleted.map((item) => item.linkId)
    attributions.value = attributions.value.map((item) => newlyCompleted.some((completed) => completed.id === item.id)
      ? { ...item, firstMatchAt: playedAt }
      : item)
    links.value = links.value.map((link) => linkIds.includes(link.id)
      ? { ...link, firstMatchesCount: link.firstMatchesCount + 1, points: link.points + 25 }
      : link)
    return newlyCompleted.length
  }
}
