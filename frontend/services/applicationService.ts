import { mockTournamentApplications } from '~/data/mock/tournamentApplications'
import type { ApplicationStatus, TournamentApplication } from '~/types/domain'

export interface ApplicationPayload {
  tournamentId: string
  teamId: string
  captainId: string
  comment?: string
}

export const applicationService = {
  async list(filters: { tournamentId?: string; teamId?: string; status?: ApplicationStatus } = {}) {
    return mockTournamentApplications
      .filter((application) => (filters.tournamentId ? application.tournamentId === filters.tournamentId : true))
      .filter((application) => (filters.teamId ? application.teamId === filters.teamId : true))
      .filter((application) => (filters.status ? application.status === filters.status : true))
  },

  async getById(id: string) {
    return mockTournamentApplications.find((application) => application.id === id) ?? null
  },

  async create(payload: ApplicationPayload): Promise<TournamentApplication> {
    const now = new Date().toISOString()

    return {
      id: 'mock-new-application',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      ...payload
    }
  },

  async updateStatus(id: string, status: ApplicationStatus, rejectReason?: string) {
    const application = mockTournamentApplications.find((item) => item.id === id)
    return application ? { ...application, status, rejectReason, updatedAt: new Date().toISOString() } : null
  }
}
