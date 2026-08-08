import assert from 'node:assert/strict'
import test from 'node:test'
import { findTournamentDataIssues } from '../utils/tournamentDataIntegrity.ts'

const application = { id: 'a1', tournamentId: 'tr1', teamId: 't1', captainId: 'u1', status: 'approved', createdAt: '', updatedAt: '' }
const roster = { id: 'r1', tournamentId: 'tr1', teamId: 't1', playerIds: ['u1'], captainId: 'u1', submittedAt: '', locked: true }
const match = { id: 'm1', tournamentId: 'tr1', sport: 'cs2', team1Id: 't1', team2Id: 't1', scheduledAt: '', location: '', status: 'scheduled' }
const bracket = { id: 'b1', tournamentId: 'tr1', matchId: 'm1', round: 1, roundName: 'Финал', position: 1, team1Id: 't1', team2Id: 't1', status: 'scheduled' }

test('согласованные заявка, состав, сетка и матч проходят проверку', () => {
  assert.deepEqual(findTournamentDataIssues([application], [roster], [bracket], [match]), [])
})

test('находит команду без заявки, состав без заявки и матч-сироту', () => {
  const issues = findTournamentDataIssues([application], [], [{ ...bracket, matchId: 'missing', team2Id: 't2' }], [{ ...match, team2Id: 't2' }])
  assert.ok(issues.some((issue) => issue.includes('нет турнирного состава')))
  assert.ok(issues.some((issue) => issue.includes('отсутствующий матч')))
  assert.ok(issues.some((issue) => issue.includes('tr1:t2')))
})
