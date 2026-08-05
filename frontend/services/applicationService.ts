import { useMockTeams, useMockTournamentApplications, useMockTournamentRosters, useMockTournaments, useMockUsers } from '~/data/mock/state'
import type { ApplicationStatus, TournamentApplication, TournamentRoster } from '~/types/domain'

export interface ApplicationPayload {
  tournamentId: string
  teamId: string
  submittedByUserId: string
  playerIds: string[]
  tournamentCaptainId: string
  comment?: string
}

export interface ApplicationConflict {
  userId: string
  userName: string
  teamId: string
  teamName: string
}

export interface ApplicationCheck {
  eligible: boolean
  issues: string[]
  conflicts: ApplicationConflict[]
  existingApplication: TournamentApplication | null
}

const activeApplicationStatuses: ApplicationStatus[] = ['pending', 'approved']

const getApplicationCheck = (payload: ApplicationPayload): ApplicationCheck => {
  const tournaments = useMockTournaments().value
  const teams = useMockTeams().value
  const users = useMockUsers().value
  const applications = useMockTournamentApplications().value
  const rosters = useMockTournamentRosters().value
  const tournament = tournaments.find((item) => item.id === payload.tournamentId)
  const team = teams.find((item) => item.id === payload.teamId)
  const existingApplication = applications.find((item) => item.tournamentId === payload.tournamentId && item.teamId === payload.teamId) ?? null
  const issues: string[] = []
  const conflicts: ApplicationConflict[] = []
  const playerIds = [...new Set(payload.playerIds)]

  if (!tournament) issues.push('Турнир не найден.')
  if (!team) issues.push('Команда не найдена.')
  if (!tournament || !team) return { eligible: false, issues, conflicts, existingApplication }

  if (tournament.status !== 'registration_open') issues.push('Приём заявок уже закрыт.')
  if (team.captainId !== payload.submittedByUserId) issues.push('Подать заявку может только капитан команды.')
  if (team.sport !== tournament.sport) issues.push('Вид спорта команды не совпадает с турниром.')
  if (playerIds.length !== tournament.requiredTeamSize) {
    issues.push(`Выберите ровно ${tournament.requiredTeamSize} игроков.`)
  }
  if (playerIds.some((userId) => !team.memberIds.includes(userId))) {
    issues.push('В составе есть игрок, который не состоит в команде.')
  }
  if (!playerIds.includes(payload.tournamentCaptainId)) {
    issues.push('Капитан турнира должен входить в заявочный состав.')
  }

  if (existingApplication?.status === 'pending') issues.push('Заявка этой команды уже на проверке.')
  if (existingApplication?.status === 'approved') issues.push('Команда уже допущена к турниру.')
  if (existingApplication?.status === 'excluded') issues.push('Повторную заявку после исключения должен разрешить администратор.')
  if (existingApplication?.status === 'rejected' && !existingApplication.reapplyAllowed) {
    issues.push('Повторная подача этой заявки пока недоступна.')
  }

  const approvedCount = applications.filter((item) => item.tournamentId === tournament.id && item.status === 'approved').length
  if (approvedCount >= tournament.maxTeams) issues.push('Все места в турнире уже заняты.')

  playerIds.forEach((userId) => {
    const user = users.find((item) => item.id === userId)
    if (!user) {
      issues.push('Один из игроков не найден.')
      return
    }
    if (user.age === undefined) {
      issues.push(`${user.name}: не указан возраст.`)
    } else if ((tournament.minAge !== undefined && user.age < tournament.minAge) || (tournament.maxAge !== undefined && user.age > tournament.maxAge)) {
      issues.push(`${user.name}: возраст не подходит под требования турнира.`)
    }
  })

  const otherActiveApplications = applications.filter((item) =>
    item.tournamentId === tournament.id
    && item.teamId !== team.id
    && activeApplicationStatuses.includes(item.status)
  )

  otherActiveApplications.forEach((application) => {
    const roster = rosters.find((item) => item.tournamentId === tournament.id && item.teamId === application.teamId)
    const otherTeam = teams.find((item) => item.id === application.teamId)
    roster?.playerIds.filter((userId) => playerIds.includes(userId)).forEach((userId) => {
      const user = users.find((item) => item.id === userId)
      conflicts.push({
        userId,
        userName: user?.name ?? 'Игрок',
        teamId: application.teamId,
        teamName: otherTeam?.name ?? 'Другая команда'
      })
    })
  })

  if (conflicts.length) issues.push('Некоторые игроки уже заявлены за другую команду в этом турнире.')

  return { eligible: issues.length === 0, issues, conflicts, existingApplication }
}

export const applicationService = {
  async list(filters: { tournamentId?: string; teamId?: string; status?: ApplicationStatus } = {}) {
    return useMockTournamentApplications().value
      .filter((application) => (filters.tournamentId ? application.tournamentId === filters.tournamentId : true))
      .filter((application) => (filters.teamId ? application.teamId === filters.teamId : true))
      .filter((application) => (filters.status ? application.status === filters.status : true))
  },

  async getById(id: string) {
    return useMockTournamentApplications().value.find((application) => application.id === id) ?? null
  },

  async check(payload: ApplicationPayload) {
    return getApplicationCheck(payload)
  },

  async create(payload: ApplicationPayload): Promise<{ application: TournamentApplication; roster: TournamentRoster }> {
    const check = getApplicationCheck(payload)
    if (!check.eligible) throw new Error('application_invalid')

    const applications = useMockTournamentApplications()
    const rosters = useMockTournamentRosters()
    const now = new Date().toISOString()
    const existing = check.existingApplication
    const application: TournamentApplication = existing
      ? {
          ...existing,
          captainId: payload.submittedByUserId,
          status: 'pending',
          comment: payload.comment,
          rejectReason: undefined,
          reapplyAllowed: false,
          updatedAt: now
        }
      : {
          id: `application-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          tournamentId: payload.tournamentId,
          teamId: payload.teamId,
          captainId: payload.submittedByUserId,
          status: 'pending',
          createdAt: now,
          updatedAt: now,
          comment: payload.comment
        }
    const roster: TournamentRoster = {
      id: `roster-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      tournamentId: payload.tournamentId,
      teamId: payload.teamId,
      playerIds: [...new Set(payload.playerIds)],
      captainId: payload.tournamentCaptainId,
      submittedAt: now,
      locked: false
    }

    applications.value = existing
      ? applications.value.map((item) => item.id === existing.id ? application : item)
      : [application, ...applications.value]
    rosters.value = [
      ...rosters.value.filter((item) => !(item.tournamentId === payload.tournamentId && item.teamId === payload.teamId)),
      roster
    ]

    return { application, roster }
  },

  async listRosters(filters: { tournamentId?: string; teamId?: string } = {}) {
    return useMockTournamentRosters().value
      .filter((roster) => (filters.tournamentId ? roster.tournamentId === filters.tournamentId : true))
      .filter((roster) => (filters.teamId ? roster.teamId === filters.teamId : true))
  },

  async getRoster(tournamentId: string, teamId: string) {
    return useMockTournamentRosters().value.find((roster) => roster.tournamentId === tournamentId && roster.teamId === teamId) ?? null
  },

  async updateStatus(id: string, status: ApplicationStatus, rejectReason?: string) {
    const applications = useMockTournamentApplications()
    const application = applications.value.find((item) => item.id === id)
    if (!application) return null
    const updated = { ...application, status, rejectReason, updatedAt: new Date().toISOString() }
    applications.value = applications.value.map((item) => item.id === id ? updated : item)
    return updated
  }
}
