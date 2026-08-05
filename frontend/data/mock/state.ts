import { mockTeamInvites, mockTeamJoinRequests, mockTeamMemberBlocks, mockTeamMembers, mockTeams } from './teams'
import { mockTournamentApplications } from './tournamentApplications'
import { mockTournamentRosters } from './tournamentRosters'
import { mockTournaments } from './tournaments'
import { mockUsers } from './users'
import { mockBracketMatches } from './brackets'
import { mockMatches } from './matches'
import type { BracketMatch, Match, Team, TeamInvite, TeamJoinRequest, TeamMember, TeamMemberBlock, Tournament, TournamentApplication, TournamentRoster, User } from '~/types/domain'

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

export const useMockUsers = () => usePersistentMockState<User[]>('ra_mock_users_v4', mockUsers)
export const useMockTeams = () => usePersistentMockState<Team[]>('ra_mock_teams_v4', mockTeams)
export const useMockTeamMembers = () => usePersistentMockState<TeamMember[]>('ra_mock_team_members_v4', mockTeamMembers)
export const useMockTeamInvites = () => usePersistentMockState<TeamInvite[]>('ra_mock_team_invites_v4', mockTeamInvites)
export const useMockTeamJoinRequests = () => usePersistentMockState<TeamJoinRequest[]>('ra_mock_team_requests_v4', mockTeamJoinRequests)
export const useMockTeamMemberBlocks = () => usePersistentMockState<TeamMemberBlock[]>('ra_mock_team_blocks_v4', mockTeamMemberBlocks)
export const useMockTournaments = () => usePersistentMockState<Tournament[]>('ra_mock_tournaments_v4', mockTournaments)
export const useMockTournamentApplications = () => usePersistentMockState<TournamentApplication[]>('ra_mock_tournament_applications_v4', mockTournamentApplications)
export const useMockTournamentRosters = () => usePersistentMockState<TournamentRoster[]>('ra_mock_tournament_rosters_v4', mockTournamentRosters)
export const useMockMatches = () => usePersistentMockState<Match[]>('ra_mock_matches_v1', mockMatches)
export const useMockBracketMatches = () => usePersistentMockState<BracketMatch[]>('ra_mock_brackets_v2', mockBracketMatches)
