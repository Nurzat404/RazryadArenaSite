import {
  useMockBracketMatches,
  useMockMapVetoSessions,
  useMockMatches,
  useMockTeams,
  useMockTournamentRosters,
  useMockTournaments,
  useMockUsers
} from '~/data/mock/state'
import type { Cs2MatchFormat, MapVetoAction, MapVetoSession, Match, Team, Tournament, VetoLaunchMode } from '~/types/domain'
import { mapVetoSequence, validateMapPool } from '~/utils/mapVetoSequence'
import { notificationService } from './notificationService'

const TURN_TIMEOUT_MS = 5 * 60 * 1000

export interface VetoContext {
  match: Match
  tournament: Tournament
  team1: Team
  team2: Team
  session: MapVetoSession
  team1CaptainId?: string
  team2CaptainId?: string
  availableMaps: string[]
}

export interface VetoSettingsPayload {
  enabled: boolean
  launchMode: VetoLaunchMode
  mapPool: string[]
}

const normalizeFormat = (value: string): Cs2MatchFormat => {
  const format = value.match(/BO([135])/i)?.[1]
  return format === '1' ? 'bo1' as const : format === '5' ? 'bo5' as const : 'bo3' as const
}

const formatForMatch = (match: Match, tournament: Tournament): Cs2MatchFormat => {
  const bracket = useMockBracketMatches().value.find((item) => item.matchId === match.id)
  const formats = tournament.stageMatchFormats
  if (!formats || !bracket) return normalizeFormat(tournament.matchFormat)
  if (bracket.isThirdPlace || /полуфинал/i.test(bracket.roundName)) return formats.semifinal
  if (/финал/i.test(bracket.roundName)) return formats.final
  return formats.earlyRound
}

const strictestFormat = (tournament: Tournament): Cs2MatchFormat => {
  const formats = tournament.stageMatchFormats
    ? Object.values(tournament.stageMatchFormats)
    : [normalizeFormat(tournament.matchFormat)]
  return formats.includes('bo5') ? 'bo5' : formats.includes('bo3') ? 'bo3' : 'bo1'
}

const normalizePool = (maps: string[]) => maps.map((map) => map.trim()).filter(Boolean)

const validatePool = (format: MapVetoSession['format'], maps: string[]) => {
  return validateMapPool(format, maps)
}

const rosterCaptainId = (tournamentId: string, teamId: string) =>
  useMockTournamentRosters().value.find((roster) => roster.tournamentId === tournamentId && roster.teamId === teamId)?.captainId

const getTournament = (id: string) => useMockTournaments().value.find((item) => item.id === id) ?? null
const getMatch = (id: string) => useMockMatches().value.find((item) => item.id === id) ?? null

const usedMaps = (session: MapVetoSession) => new Set(
  session.actions
    .filter((action) => action.type === 'ban' || action.type === 'pick')
    .map((action) => action.map.toLowerCase())
)

const availableMaps = (session: MapVetoSession) => session.mapPool.filter((map) => !usedMaps(session).has(map.toLowerCase()))

const finalMaps = (session: MapVetoSession) => {
  const picks = session.actions.filter((action) => action.type === 'pick').map((action) => action.map)
  const remaining = availableMaps(session)
  return [...picks, ...remaining.slice(0, 1)]
}

const resolveTurn = (session: MapVetoSession) => {
  const actions = session.actions.filter((action) => action.type === 'ban' || action.type === 'pick')
  const remaining = availableMaps(session)
  const step = mapVetoSequence(session.format, session.mapPool.length)[actions.length]
  if (!step || remaining.length <= 1) return { status: 'finished' as const }
  return {
    status: 'active' as const,
    teamId: step.team === 'team1' ? session.team1Id : session.team2Id,
    actionType: step.actionType
  }
}

const replaceSession = (updated: MapVetoSession) => {
  const sessions = useMockMapVetoSessions()
  sessions.value = sessions.value.map((item) => item.id === updated.id ? updated : item)
  return updated
}

const appendAction = (session: MapVetoSession, action: Omit<MapVetoAction, 'id' | 'sessionId' | 'createdAt'>) => ({
  ...session,
  actions: [...session.actions, {
    id: `veto-action-${session.id}-${session.actions.length + 1}-${Date.now()}`,
    sessionId: session.id,
    createdAt: new Date().toISOString(),
    ...action
  }]
})

const participantCaptainIds = (context: Pick<VetoContext, 'team1CaptainId' | 'team2CaptainId'>) =>
  [...new Set([context.team1CaptainId, context.team2CaptainId].filter(Boolean) as string[])]

const notifyCaptains = async (context: VetoContext, type: 'started' | 'turn' | 'finished') => {
  const recipientIds = participantCaptainIds(context)
  const isTurn = type === 'turn'
  const currentTeamName = context.session.currentTeamId === context.team1.id ? context.team1.name : context.team2.name
  const title = type === 'started'
    ? 'Пик/бан карт начался'
    : type === 'finished'
      ? 'Карты на матч определены'
      : `Ход команды ${currentTeamName}`
  const body = type === 'finished'
    ? `Сыграют: ${context.session.finalMaps.join(', ')}.`
    : isTurn
      ? `${context.session.currentActionType === 'ban' ? 'Запретите' : 'Выберите'} карту в течение 5 минут.`
      : 'Откройте матч и выполните первый ход.'

  await Promise.all(recipientIds.map((userId) => notificationService.createOnce(
    `veto-${type}-${context.session.id}-${context.session.actions.length}-${userId}`,
    { userId, type: type === 'turn' ? 'veto_turn' : 'veto_started', title, body, actionUrl: `/matches/${context.match.id}/veto` }
 )))
}

const createSession = (match: Match, tournament: Tournament): MapVetoSession => {
  const format = formatForMatch(match, tournament)
  const pool = normalizePool(tournament.mapPool ?? [])
  const session: MapVetoSession = {
    id: `veto-${match.id}`,
    matchId: match.id,
    team1Id: match.team1Id,
    team2Id: match.team2Id,
    status: 'pending',
    format,
    mapPool: pool,
    finalMaps: [],
    actions: []
  }
  const sessions = useMockMapVetoSessions()
  sessions.value = [...sessions.value, session]
  return session
}

const buildContext = (matchId: string, create = true): VetoContext | null => {
  const match = getMatch(matchId)
  if (!match || match.sport !== 'cs2') return null
  const savedSession = useMockMapVetoSessions().value.find((item) => item.matchId === matchId)
  if (['finished', 'technical_win'].includes(match.status) && (!savedSession?.finalMaps.length || savedSession.status !== 'finished')) return null
  const tournament = getTournament(match.tournamentId)
  const [team1, team2] = [
    useMockTeams().value.find((team) => team.id === match.team1Id),
    useMockTeams().value.find((team) => team.id === match.team2Id)
  ]
  if (!tournament || !team1 || !team2 || !tournament.mapVetoEnabled) return null
  const format = formatForMatch(match, tournament)
  if (validatePool(format, tournament.mapPool ?? [])) return null
  let session = savedSession
  if (!session && create) session = createSession(match, tournament)
  if (!session) return null
  return {
    match,
    tournament,
    team1,
    team2,
    session,
    team1CaptainId: rosterCaptainId(tournament.id, team1.id),
    team2CaptainId: rosterCaptainId(tournament.id, team2.id),
    availableMaps: availableMaps(session)
  }
}

const requireAdmin = (userId: string) => {
  if (useMockUsers().value.find((user) => user.id === userId)?.role !== 'admin') throw new Error('Нет прав на управление veto.')
}

const activate = async (context: VetoContext, startedByUserId?: string) => {
  const turn = resolveTurn(context.session)
  const now = new Date().toISOString()
  let updated = appendAction(context.session, { type: 'start', map: '', teamId: undefined })
  updated = turn.status === 'finished'
    ? { ...updated, status: 'finished', currentTeamId: undefined, currentActionType: undefined, deadlineAt: undefined, completedAt: now, finalMaps: finalMaps(updated), startedAt: now, startedByUserId }
    : { ...updated, status: 'active', currentTeamId: turn.teamId, currentActionType: turn.actionType, turnStartedAt: now, deadlineAt: new Date(Date.now() + TURN_TIMEOUT_MS).toISOString(), startedAt: now, startedByUserId, timeoutNotifiedAt: undefined }
  replaceSession(updated)
  const refreshed = buildContext(context.match.id, false)
  if (refreshed) await notifyCaptains(refreshed, updated.status === 'finished' ? 'finished' : 'started')
  if (refreshed?.session.status === 'active') await notifyCaptains(refreshed, 'turn')
  return updated
}

const syncScheduledLaunch = async (context: VetoContext) => {
  if (context.session.status !== 'pending' || Date.parse(context.match.scheduledAt) > Date.now()) return context.session
  if (context.tournament.vetoLaunchMode === 'auto_start') return activate(context)

  const admins = useMockUsers().value.filter((user) => user.role === 'admin')
  await Promise.all(admins.map((admin) => notificationService.createOnce(
    `veto-awaiting-start-${context.match.id}-${admin.id}`,
    {
      userId: admin.id,
      type: 'admin_action',
      title: 'Пора запустить пик/бан',
      body: `${context.team1.name} сыграет с ${context.team2.name}. Время матча наступило.`,
      actionUrl: `/matches/${context.match.id}/veto`
    }
  )))
  return context.session
}

export const vetoService = {
  validatePool,

  async getByMatchId(matchId: string) {
    return useMockMapVetoSessions().value.find((session) => session.matchId === matchId) ?? null
  },

  async getContext(matchId: string) {
    let context = buildContext(matchId)
    if (!context) return null
    await syncScheduledLaunch(context)
    await this.checkTimeout(matchId)
    context = buildContext(matchId, false)
    return context
  },

  async listByTournament(tournamentId: string) {
    const contexts = useMockMatches().value
      .filter((match) => match.tournamentId === tournamentId && match.sport === 'cs2' && !['finished', 'technical_win'].includes(match.status))
      .map((match) => buildContext(match.id))
      .filter((context): context is VetoContext => Boolean(context))
    await Promise.all(contexts.map((context) => syncScheduledLaunch(context)))
    return contexts.map((context) => buildContext(context.match.id, false)).filter((context): context is VetoContext => Boolean(context))
  },

  async syncScheduled() {
    const contexts = useMockMatches().value
      .filter((match) => match.sport === 'cs2' && !['finished', 'technical_win'].includes(match.status))
      .map((match) => buildContext(match.id))
      .filter((context): context is VetoContext => Boolean(context))
    await Promise.all(contexts.map((context) => syncScheduledLaunch(context)))
  },

  async start(matchId: string, userId: string) {
    requireAdmin(userId)
    const context = buildContext(matchId)
    if (!context) throw new Error('Veto недоступно для этого матча.')
    if (context.match.status === 'finished' || context.match.status === 'technical_win') throw new Error('Матч уже завершён.')
    if (context.tournament.vetoLaunchMode !== 'admin_start') throw new Error('Для этого матча включён автоматический запуск.')
    if (Date.parse(context.match.scheduledAt) > Date.now()) throw new Error('Пик/бан можно запустить, когда наступит время матча.')
    if (context.session.status === 'active') return context.session
    if (context.session.status === 'finished') throw new Error('Пик/бан уже завершён.')
    if (context.session.status === 'cancelled') throw new Error('Сначала сбросьте отменённый veto.')
    return activate(context, userId)
  },

  async addAction(matchId: string, userId: string, map: string) {
    const context = buildContext(matchId, false)
    if (!context || context.session.status !== 'active') throw new Error('Пик/бан ещё не запущен.')
    const currentCaptainId = context.session.currentTeamId === context.team1.id ? context.team1CaptainId : context.team2CaptainId
    if (currentCaptainId !== userId) throw new Error('Сейчас ход другого капитана.')
    const selected = context.availableMaps.find((item) => item.toLowerCase() === map.trim().toLowerCase())
    if (!selected) throw new Error('Эта карта уже недоступна.')

    const withAction = appendAction(context.session, {
      type: context.session.currentActionType ?? 'ban',
      map: selected,
      teamId: context.session.currentTeamId
    })
    const turn = resolveTurn(withAction)
    const now = new Date().toISOString()
    const updated = turn.status === 'finished'
      ? { ...withAction, status: 'finished' as const, currentTeamId: undefined, currentActionType: undefined, deadlineAt: undefined, completedAt: now, finalMaps: finalMaps(withAction) }
      : { ...withAction, status: 'active' as const, currentTeamId: turn.teamId, currentActionType: turn.actionType, turnStartedAt: now, deadlineAt: new Date(Date.now() + TURN_TIMEOUT_MS).toISOString(), timeoutNotifiedAt: undefined }
    replaceSession(updated)
    const refreshed = buildContext(matchId, false)
    if (refreshed) await notifyCaptains(refreshed, updated.status === 'finished' ? 'finished' : 'turn')
    return updated
  },

  async checkTimeout(matchId: string) {
    const session = await this.getByMatchId(matchId)
    if (!session || session.status !== 'active' || !session.deadlineAt || session.timeoutNotifiedAt || Date.parse(session.deadlineAt) > Date.now()) return session
    const updated = replaceSession({ ...session, timeoutNotifiedAt: new Date().toISOString() })
    const context = buildContext(matchId, false)
    const admins = useMockUsers().value.filter((user) => user.role === 'admin')
    if (context) {
      await Promise.all(admins.map((user) => notificationService.createOnce(
        `veto-timeout-${session.id}-${session.actions.length}-${user.id}`,
        {
          userId: user.id,
          type: 'admin_action',
          title: 'Истекло время хода в veto',
          body: `У команды ${context.session.currentTeamId === context.team1.id ? context.team1.name : context.team2.name} было 5 минут на действие.`,
          actionUrl: `/admin/tournaments/${context.tournament.id}/veto`
        }
      )))
    }
    return updated
  },

  async dismissTimeout(matchId: string, userId: string) {
    requireAdmin(userId)
    const context = buildContext(matchId, false)
    if (!context?.session.timeoutNotifiedAt || context.session.status !== 'active') throw new Error('Нет активного предупреждения.')
    return replaceSession({ ...context.session, timeoutNotifiedAt: undefined, deadlineAt: new Date(Date.now() + TURN_TIMEOUT_MS).toISOString(), turnStartedAt: new Date().toISOString() })
  },

  async awardTimeoutTechnicalWin(matchId: string, userId: string) {
    requireAdmin(userId)
    const context = buildContext(matchId, false)
    if (!context?.session.timeoutNotifiedAt || !context.session.currentTeamId) throw new Error('Нет активного предупреждения.')
    const loserId = context.session.currentTeamId
    const winnerId = loserId === context.match.team1Id ? context.match.team2Id : context.match.team1Id
    const { matchResultService } = await import('./matchResultService')
    return matchResultService.submit(matchId, {
      score1: winnerId === context.match.team1Id ? 1 : 0,
      score2: winnerId === context.match.team2Id ? 1 : 0,
      winnerId,
      technicalReason: 'Не выполнен пик/бан карт в течение 5 минут.'
    }, userId)
  },

  async cancel(matchId: string, userId: string) {
    requireAdmin(userId)
    const context = buildContext(matchId, false)
    if (!context) throw new Error('Veto не найден.')
    if (context.session.status === 'finished') throw new Error('Нельзя отменить завершённый veto.')
    return replaceSession({
      ...appendAction(context.session, { type: 'cancel', map: '', teamId: undefined }),
      status: 'cancelled', currentTeamId: undefined, currentActionType: undefined, deadlineAt: undefined, cancelledAt: new Date().toISOString(), timeoutNotifiedAt: undefined
    })
  },

  async reset(matchId: string, userId: string) {
    requireAdmin(userId)
    const context = buildContext(matchId, false)
    if (!context) throw new Error('Veto не найден.')
    if (['finished', 'technical_win'].includes(context.match.status)) throw new Error('Нельзя сбросить veto после завершения матча.')
    return replaceSession({
      ...context.session,
      status: 'pending', currentTeamId: undefined, currentActionType: undefined, deadlineAt: undefined,
      turnStartedAt: undefined, timeoutNotifiedAt: undefined, finalMaps: [], startedAt: undefined, completedAt: undefined, cancelledAt: undefined,
      actions: [{ id: `veto-action-${context.session.id}-reset-${Date.now()}`, sessionId: context.session.id, type: 'reset', map: '', createdAt: new Date().toISOString() }]
    })
  },

  async updateTournamentSettings(tournamentId: string, payload: VetoSettingsPayload, userId: string) {
    requireAdmin(userId)
    const tournaments = useMockTournaments()
    const tournament = tournaments.value.find((item) => item.id === tournamentId)
    if (!tournament || tournament.sport !== 'cs2') throw new Error('Настройки veto доступны только для CS2-турнира.')
    const format = strictestFormat(tournament)
    const pool = normalizePool(payload.mapPool)
    if (payload.enabled) {
      const validation = validatePool(format, pool)
      if (validation) throw new Error(validation)
    }
    const hasActiveSession = useMockMapVetoSessions().value.some((session) => {
      const match = getMatch(session.matchId)
      return match?.tournamentId === tournamentId && session.status === 'active'
    })
    if (hasActiveSession) throw new Error('Нельзя менять пул карт, пока идёт pick/ban.')
    const updated = { ...tournament, mapVetoEnabled: payload.enabled, vetoLaunchMode: payload.launchMode, mapPool: pool }
    tournaments.value = tournaments.value.map((item) => item.id === tournamentId ? updated : item)
    const sessions = useMockMapVetoSessions()
    sessions.value = sessions.value.map((session) => {
      const match = getMatch(session.matchId)
      if (match?.tournamentId !== tournamentId || ['active', 'finished'].includes(session.status)) return session
      return {
        ...session,
        format,
        mapPool: pool,
        status: 'pending',
        currentTeamId: undefined,
        currentActionType: undefined,
        deadlineAt: undefined,
        turnStartedAt: undefined,
        timeoutNotifiedAt: undefined,
        finalMaps: [],
        actions: []
      }
    })
    return updated
  },

  async finishByMatchId(matchId: string) {
    const session = await this.getByMatchId(matchId)
    if (!session || session.status === 'finished') return session
    return replaceSession({ ...session, status: 'finished', currentTeamId: undefined, currentActionType: undefined, deadlineAt: undefined, completedAt: new Date().toISOString(), timeoutNotifiedAt: undefined })
  }
}
