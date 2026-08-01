import { mockTeamInvites, mockTeamJoinRequests, mockTeamMemberBlocks, mockTeamMembers, mockTeams } from './teams'
import { mockUsers } from './users'
import type { Team, TeamInvite, TeamJoinRequest, TeamMember, TeamMemberBlock, User } from '~/types/domain'

const cookieOptions = {
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 30,
  watch: true as const
}

const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export const useMockUsers = () => useCookie<User[]>('ra_mock_users_v2', {
  ...cookieOptions,
  default: () => copy(mockUsers)
})

export const useMockTeams = () => useCookie<Team[]>('ra_mock_teams_v2', {
  ...cookieOptions,
  default: () => copy(mockTeams)
})

export const useMockTeamMembers = () => useCookie<TeamMember[]>('ra_mock_team_members_v2', {
  ...cookieOptions,
  default: () => copy(mockTeamMembers)
})

export const useMockTeamInvites = () => useCookie<TeamInvite[]>('ra_mock_team_invites_v2', {
  ...cookieOptions,
  default: () => copy(mockTeamInvites)
})

export const useMockTeamJoinRequests = () => useCookie<TeamJoinRequest[]>('ra_mock_team_requests_v2', {
  ...cookieOptions,
  default: () => copy(mockTeamJoinRequests)
})

export const useMockTeamMemberBlocks = () => useCookie<TeamMemberBlock[]>('ra_mock_team_blocks_v2', {
  ...cookieOptions,
  default: () => copy(mockTeamMemberBlocks)
})
