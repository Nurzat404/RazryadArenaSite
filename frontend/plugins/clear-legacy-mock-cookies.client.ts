const legacyCookieNames = [
  'ra_mock_users_v2', 'ra_mock_users_v3',
  'ra_mock_teams_v2', 'ra_mock_teams_v3',
  'ra_mock_team_members_v2', 'ra_mock_team_members_v3',
  'ra_mock_team_invites_v2', 'ra_mock_team_invites_v3',
  'ra_mock_team_requests_v2', 'ra_mock_team_requests_v3',
  'ra_mock_team_blocks_v2', 'ra_mock_team_blocks_v3',
  'ra_mock_tournaments_v1',
  'ra_mock_tournament_applications_v1',
  'ra_mock_tournament_rosters_v1'
]

export default defineNuxtPlugin(() => {
  legacyCookieNames.forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`
  })
})
