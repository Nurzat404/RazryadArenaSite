import { mockTeamAccountInvites, mockTeamInvites, mockTeamJoinRequests, mockTeamMemberBlocks, mockTeamMembers, mockTeams } from './teams'
import { mockTournamentApplications } from './tournamentApplications'
import { mockTournamentRosters } from './tournamentRosters'
import { mockTournaments } from './tournaments'
import { mockUsers } from './users'
import { mockBracketMatches } from './brackets'
import { mockMatches } from './matches'
import { mockMapVetoSessions } from './mapVeto'
import { mockNotifications } from './notifications'
import { mockPlayerStats } from './stats'
import { mockMatchResultDetails } from './matchResultDetails'
import { mockRatings } from './ratings'
import { mockReferralAttributions, mockReferralLinks } from './referrals'
import type { BracketMatch, BracketTechnicalParticipant, MapVetoSession, Match, MatchRatingEvent, MatchResultDetails, MatchResultRevision, Notification, PlayerStats, RatingRow, ReferralAttribution, ReferralLink, Team, TeamAccountInvite, TeamInvite, TeamJoinRequest, TeamMember, TeamMemberBlock, Tournament, TournamentApplication, TournamentRoster, User } from '~/types/domain'

const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const loadedKeys = new Set<string>()

const usePersistentMockState = <T>(key: string, initialValue: T) => {
  const state = useState<T>(key, () => copy(initialValue))

  if (import.meta.client && !loadedKeys.has(key)) {
    loadedKeys.add(key)
    const stored = window.localStorage.getItem(key)

    if (stored) {
      try {
        state.value = JSON.parse(stored) as T
      } catch {
        window.localStorage.removeItem(key)
      }
    }

    watch(state, (value) => {
      window.localStorage.setItem(key, JSON.stringify(value))
    }, { deep: true })
  }

  return state
}

export const useMockUsers = () => {
  const users = usePersistentMockState<User[]>('ra_mock_users_v4', mockUsers)
  const missingUsers = mockUsers.filter((user) => ['u9', 'u10'].includes(user.id) && !users.value.some((item) => item.id === user.id))
  if (import.meta.client && missingUsers.length) users.value = [...users.value, ...missingUsers]
  return users
}
export const useMockTeams = () => {
  const teams = usePersistentMockState<Team[]>('ra_mock_teams_v4', mockTeams)
  const missingTeams = mockTeams.filter((team) => ['t6', 't7', 't8'].includes(team.id) && !teams.value.some((item) => item.id === team.id))
  if (import.meta.client && missingTeams.length) teams.value = [...teams.value, ...missingTeams]
  return teams
}
export const useMockTeamMembers = () => {
  const members = usePersistentMockState<TeamMember[]>('ra_mock_team_members_v4', mockTeamMembers)
  const missingMembers = mockTeamMembers.filter((member) => ['tm9', 'tm10', 'tm11'].includes(member.id) && !members.value.some((item) => item.id === member.id))
  if (import.meta.client && missingMembers.length) members.value = [...members.value, ...missingMembers]
  return members
}
export const useMockTeamInvites = () => usePersistentMockState<TeamInvite[]>('ra_mock_team_invites_v4', mockTeamInvites)
export const useMockTeamAccountInvites = () => usePersistentMockState<TeamAccountInvite[]>('ra_mock_team_account_invites_v1', mockTeamAccountInvites)
export const useMockTeamJoinRequests = () => usePersistentMockState<TeamJoinRequest[]>('ra_mock_team_requests_v4', mockTeamJoinRequests)
export const useMockTeamMemberBlocks = () => usePersistentMockState<TeamMemberBlock[]>('ra_mock_team_blocks_v4', mockTeamMemberBlocks)
export const useMockTournaments = () => {
  const tournaments = usePersistentMockState<Tournament[]>('ra_mock_tournaments_v5', mockTournaments)
  const activeCup = mockTournaments.find((tournament) => tournament.id === 'tr1')
  const openCup = mockTournaments.find((tournament) => tournament.id === 'tr5')
  const currentCup = tournaments.value.find((tournament) => tournament.id === 'tr1')

  if (import.meta.client && currentCup && activeCup && (currentCup.status === 'registration_open' || currentCup.matchFormat.includes('BO1') || currentCup.mapVetoEnabled === undefined)) {
    tournaments.value = tournaments.value.map((tournament) => tournament.id === 'tr1' ? { ...tournament, ...activeCup } : tournament)
  }
  if (import.meta.client && openCup && !tournaments.value.some((tournament) => tournament.id === openCup.id)) {
    tournaments.value = [...tournaments.value, openCup]
  }
  return tournaments
}
export const useMockTournamentApplications = () => {
  const applications = usePersistentMockState<TournamentApplication[]>('ra_mock_tournament_applications_v4', mockTournamentApplications)
  const missing = mockTournamentApplications.filter((application) => ['app5', 'app6', 'app7', 'app8', 'app9'].includes(application.id) && !applications.value.some((item) => item.id === application.id))
  if (import.meta.client && missing.length) applications.value = [...applications.value, ...missing]
  const currentDustApplication = applications.value.find((application) => application.id === 'app2')
  if (import.meta.client && currentDustApplication?.status === 'pending') {
    applications.value = applications.value.map((application) => application.id === 'app2' ? { ...application, status: 'approved' } : application)
  }
  const currentRejectedApplication = applications.value.find((application) => application.id === 'app4')
  const rejectedApplication = mockTournamentApplications.find((application) => application.id === 'app4')
  if (import.meta.client && currentRejectedApplication?.tournamentId === 'tr3' && rejectedApplication) {
    applications.value = applications.value.map((application) => application.id === 'app4' ? { ...rejectedApplication } : application)
  }
  return applications
}
export const useMockTournamentRosters = () => {
  const rosters = usePersistentMockState<TournamentRoster[]>('ra_mock_tournament_rosters_v4', mockTournamentRosters)
  const missing = mockTournamentRosters.filter((roster) => ['roster4', 'roster5', 'roster6', 'roster7', 'roster8', 'roster9'].includes(roster.id) && !rosters.value.some((item) => item.id === roster.id))
  if (import.meta.client && missing.length) rosters.value = [...rosters.value, ...missing]
  return rosters
}
export const useMockMatches = () => {
  const matches = usePersistentMockState<Match[]>('ra_mock_matches_v3', mockMatches)
  const currentTestMatch = matches.value.find((match) => match.id === 'm1')
  const testMatch = mockMatches.find((match) => match.id === 'm1')
  if (import.meta.client && currentTestMatch?.status === 'scheduled' && testMatch && Date.parse(currentTestMatch.scheduledAt) > Date.now() + 24 * 60 * 60 * 1000) {
    matches.value = matches.value.map((match) => match.id === 'm1' ? { ...match, scheduledAt: testMatch.scheduledAt } : match)
  }
  return matches
}
export const useMockBracketMatches = () => {
  const brackets = usePersistentMockState<BracketMatch[]>('ra_mock_brackets_v3', mockBracketMatches)
  const volleyballMatch = mockBracketMatches.find((match) => match.id === 'bm6')
  const currentVolleyballMatch = brackets.value.find((match) => match.id === 'bm6')
  if (import.meta.client && volleyballMatch && currentVolleyballMatch && currentVolleyballMatch.matchId !== 'm3') {
    brackets.value = brackets.value.map((match) => match.id === 'bm6' ? { ...match, ...volleyballMatch } : match)
  }
  return brackets
}
export const useMockBracketTechnicalParticipants = () => usePersistentMockState<BracketTechnicalParticipant[]>('ra_mock_bracket_technical_participants_v1', [])
export const useMockMatchResultDetails = () => {
  const details = usePersistentMockState<MatchResultDetails[]>('ra_mock_match_result_details_v1', mockMatchResultDetails)
  const missing = mockMatchResultDetails.filter((result) => !details.value.some((item) => item.matchId === result.matchId))
  if (import.meta.client && missing.length) details.value = [...details.value, ...missing]
  return details
}
export const useMockMatchResultRevisions = () => usePersistentMockState<MatchResultRevision[]>('ra_mock_match_result_revisions_v1', [])
export const useMockMapVetoSessions = () => usePersistentMockState<MapVetoSession[]>('ra_mock_map_veto_sessions_v4', mockMapVetoSessions)
export const useMockMatchRatingEvents = () => usePersistentMockState<MatchRatingEvent[]>('ra_mock_match_rating_events_v1', [])
export const useMockPlayerStats = () => usePersistentMockState<PlayerStats[]>('ra_mock_player_stats_v1', mockPlayerStats)
export const useMockRatings = () => usePersistentMockState<RatingRow[]>('ra_mock_ratings_v1', mockRatings)
export const useMockReferralLinks = () => usePersistentMockState<ReferralLink[]>('ra_mock_referral_links_v1', mockReferralLinks)
export const useMockReferralAttributions = () => usePersistentMockState<ReferralAttribution[]>('ra_mock_referral_attributions_v1', mockReferralAttributions)
export const useMockNotifications = () => usePersistentMockState<Notification[]>('ra_mock_notifications_v1', mockNotifications)
