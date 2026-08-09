export type UserRole = 'player' | 'admin'

export type SportKey = 'cs2' | 'football' | 'basketball' | 'volleyball'

export type TournamentStatus = 'draft' | 'registration_open' | 'registration_closed' | 'active' | 'finished'
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'excluded'

export type MatchStatus = 'scheduled' | 'active' | 'finished' | 'technical_win'

export type VetoStatus = 'pending' | 'active' | 'finished' | 'cancelled'

export type TeamMemberRole = 'captain' | 'member' | 'substitute'

export type TeamInviteStatus = 'active' | 'used' | 'expired' | 'revoked'

export type TeamAccountInviteStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled'

export type TeamJoinRequestStatus = 'pending' | 'accepted' | 'rejected'

export type TeamInviteJoinMode = 'request' | 'direct'

export type BracketMatchStatus = 'pending' | 'scheduled' | 'finished'

export type VetoActionType = 'ban' | 'pick' | 'decider' | 'start' | 'cancel' | 'reset'
export type VetoLaunchMode = 'admin_start' | 'auto_start'
export type Cs2MatchFormat = 'bo1' | 'bo3' | 'bo5'

export type ReferralStatus = 'active' | 'disabled'

export type NotificationType =
  | 'team_request'
  | 'tournament_application_approved'
  | 'tournament_application_rejected'
  | 'match_scheduled'
  | 'match_reminder'
  | 'result_updated'
  | 'veto_started'
  | 'veto_turn'
  | 'tournament_started'
  | 'next_opponent_determined'
  | 'admin_action'

export type AdminActionType =
  | 'user_role_changed'
  | 'tournament_created'
  | 'application_approved'
  | 'application_rejected'
  | 'team_excluded'
  | 'rating_adjusted'

export type SiteNewsType = 'announcement' | 'tournament' | 'update'

export type UiStatus =
  | TournamentStatus
  | ApplicationStatus
  | MatchStatus
  | VetoStatus
  | 'team_excluded'

export interface User {
  id: string
  name: string
  email: string
  city?: string
  age?: number
  role: UserRole
  favoriteSports: SportKey[]
  emailVerified: boolean
  steamProfileUrl?: string
}

export interface Team {
  id: string
  name: string
  sport: SportKey
  city: string
  captainId: string
  memberIds: string[]
  maxMembers: number
  isOpenForRequests: boolean
  notifyOnRequests?: boolean
  inviteJoinMode?: TeamInviteJoinMode
  inviteEnabled?: boolean
  rating: number
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  role: TeamMemberRole
  joinedAt: string
  isBlocked?: boolean
}

export interface TeamMemberBlock {
  id: string
  teamId: string
  userId: string
  blockedByUserId: string
  reason?: string
  createdAt: string
}

export interface TeamInvite {
  id: string
  teamId: string
  code: string
  createdByUserId: string
  createdAt: string
  expiresAt?: string
  status: TeamInviteStatus
}

export interface TeamAccountInvite {
  id: string
  teamId: string
  userId: string
  invitedByUserId: string
  status: TeamAccountInviteStatus
  createdAt: string
  updatedAt: string
}

export interface TeamJoinRequest {
  id: string
  teamId: string
  userId: string
  message?: string
  status: TeamJoinRequestStatus
  createdAt: string
  updatedAt: string
}

export interface Tournament {
  id: string
  name: string
  sport: SportKey
  city: string
  status: TournamentStatus
  registrationStartDate: string
  registrationEndDate: string
  eventStartDate: string
  eventEndDate?: string
  maxTeams: number
  requiredTeamSize: number
  minAge?: number
  maxAge?: number
  matchFormat: string
  location: string
  rules: string[]
  mapPool?: string[]
  mapVetoEnabled?: boolean
  vetoLaunchMode?: VetoLaunchMode
  stageMatchFormats?: {
    earlyRound: Cs2MatchFormat
    semifinal: Cs2MatchFormat
    final: Cs2MatchFormat
  }
  allowRosterChanges: boolean
  description: string
}

export interface TournamentApplication {
  id: string
  tournamentId: string
  teamId: string
  captainId: string
  status: ApplicationStatus
  createdAt: string
  updatedAt: string
  comment?: string
  rejectReason?: string
  reapplyAllowed?: boolean
}

export interface TournamentRoster {
  id: string
  tournamentId: string
  teamId: string
  playerIds: string[]
  captainId: string
  submittedAt: string
  locked: boolean
}

export interface BracketMatch {
  id: string
  tournamentId: string
  matchId?: string
  round: number
  roundName: string
  position: number
  team1Id?: string
  team2Id?: string
  winnerId?: string
  nextMatchId?: string
  nextMatchSlot?: 1 | 2
  thirdPlaceMatchId?: string
  thirdPlaceSlot?: 1 | 2
  status: BracketMatchStatus
  isThirdPlace?: boolean
  isBye?: boolean
}

export interface BracketTechnicalParticipant {
  id: string
  bracketMatchId: string
  slot: 1 | 2
  label: string
  resolvedTeamId?: string
}

export interface Match {
  id: string
  tournamentId: string
  sport: SportKey
  team1Id: string
  team2Id: string
  scheduledAt: string
  location: string
  status: MatchStatus
  score1?: number
  score2?: number
  winnerId?: string
}

export interface MatchMapResult {
  mapName: string
  score1: number
  score2: number
}

export interface VolleyballSetScore {
  setNo: number
  score1: number
  score2: number
}

export interface PlayerMatchStat {
  userId: string
  kills?: number
  deaths?: number
  assists?: number
  goals?: number
  points?: number
  rebounds?: number
  setsWon?: number
  adr?: number
  headshotPercent?: number
  playerRating?: number
  fouls?: number
  aces?: number
}

export interface MatchResultDetails {
  matchId: string
  team1Id: string
  team2Id: string
  participantUserIds: string[]
  technicalReason?: string
  mapResults: MatchMapResult[]
  volleyballSets: VolleyballSetScore[]
  playerStats: PlayerMatchStat[]
  mvpUserId?: string
  updatedAt: string
}

export interface MatchResultRevision {
  id: string
  matchId: string
  changedByUserId: string
  changedAt: string
  reason: 'created' | 'updated'
  previousMatch?: Pick<Match, 'score1' | 'score2' | 'winnerId' | 'status'>
  previousDetails?: MatchResultDetails
}

export interface MatchRatingEvent {
  id: string
  matchId: string
  tournamentId: string
  sport: SportKey
  winnerTeamId: string
  loserTeamId: string
  winnerPlayerIds: string[]
  loserPlayerIds: string[]
  createdAt: string
}

export interface MapVetoAction {
  id: string
  sessionId: string
  teamId?: string
  type: VetoActionType
  map: string
  createdAt: string
}

export interface MapVetoSession {
  id: string
  matchId: string
  team1Id: string
  team2Id: string
  status: VetoStatus
  format: Cs2MatchFormat
  mapPool: string[]
  currentTeamId?: string
  currentActionType?: Extract<VetoActionType, 'ban' | 'pick'>
  deadlineAt?: string
  turnStartedAt?: string
  timeoutNotifiedAt?: string
  startedByUserId?: string
  startedAt?: string
  completedAt?: string
  cancelledAt?: string
  finalMaps: string[]
  actions: MapVetoAction[]
}

export interface RatingRow {
  id: string
  entityId: string
  entityName: string
  entityType: 'player' | 'team'
  sport: SportKey
  ratingScope?: 'overall' | 'seasonal'
  seasonId?: string
  formatKey?: string
  points: number
  position: number
}

export interface RatingSeason {
  id: string
  title: string
  sport: SportKey
  sequenceNo?: number
  startsAt: string
  endsAt?: string
  active: boolean
}

export interface PlayerStats {
  id: string
  userId: string
  sport: SportKey
  matchesPlayed: number
  wins: number
  losses: number
  rating: number
  cs2Kills?: number
  cs2Deaths?: number
  cs2Assists?: number
  cs2Adr?: number
  cs2HeadshotPercent?: number
  goals?: number
  assists?: number
  points?: number
  rebounds?: number
  setsWon?: number
  fouls?: number
  aces?: number
}

export interface ReferralLink {
  id: string
  ownerUserId: string
  title: string
  sport?: SportKey
  code: string
  status: ReferralStatus
  createdAt: string
  invitedUsersCount: number
  approvedApplicationsCount: number
  firstMatchesCount: number
  points: number
}

export interface ReferralAttribution {
  id: string
  linkId: string
  invitedUserId: string
  createdAt: string
  firstMatchAt?: string
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  createdAt: string
  readAt?: string
  actionUrl?: string
}

export interface AdminAction {
  id: string
  adminUserId: string
  type: AdminActionType
  targetType: 'user' | 'team' | 'tournament' | 'application' | 'rating'
  targetId: string
  comment?: string
  createdAt: string
}

export interface SiteNews {
  id: string
  title: string
  body: string
  type: SiteNewsType
  publishedAt: string
  actionUrl?: string
}
