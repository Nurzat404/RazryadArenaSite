import test from 'node:test'
import assert from 'node:assert/strict'
import { progressBracket } from '../utils/bracketProgression.ts'

const bracket = () => [
  {
    id: 'semi-1', tournamentId: 'cup', matchId: 'match-1', round: 1, roundName: 'Полуфинал', position: 8,
    team1Id: 'a', team2Id: 'b', nextMatchId: 'final', nextMatchSlot: 1, thirdPlaceMatchId: 'third', thirdPlaceSlot: 1, status: 'scheduled'
  },
  {
    id: 'semi-2', tournamentId: 'cup', matchId: 'match-2', round: 1, roundName: 'Полуфинал', position: 3,
    team1Id: 'c', team2Id: 'd', winnerId: 'c', nextMatchId: 'final', nextMatchSlot: 2, thirdPlaceMatchId: 'third', thirdPlaceSlot: 2, status: 'finished'
  },
  { id: 'final', tournamentId: 'cup', round: 2, roundName: 'Финал', position: 1, team2Id: 'c', status: 'pending' },
  { id: 'third', tournamentId: 'cup', round: 2, roundName: '3-е место', position: 2, team2Id: 'd', status: 'pending', isThirdPlace: true }
]

test('победитель и проигравший полуфинала попадают в нужные матчи', () => {
  const result = progressBracket(bracket(), 'match-1', 'a')
  assert.deepEqual(new Set(result.readyMatchIds), new Set(['final', 'third']))
  assert.equal(result.matches.find((match) => match.id === 'final')?.team1Id, 'a')
  assert.equal(result.matches.find((match) => match.id === 'third')?.team1Id, 'b')
})

test('повторное сохранение не сообщает о готовой паре второй раз', () => {
  const first = progressBracket(bracket(), 'match-1', 'a')
  const second = progressBracket(first.matches, 'match-1', 'a')
  assert.deepEqual(second.readyMatchIds, [])
})

test('слот перехода не зависит от номера позиции', () => {
  const result = progressBracket(bracket(), 'match-1', 'a')
  assert.equal(result.matches.find((match) => match.id === 'final')?.team1Id, 'a')
})

test('BYE можно продвинуть по идентификатору ячейки без отдельного матча', () => {
  const matches = [
    { id: 'bye', tournamentId: 'cup', round: 1, roundName: 'Раунд 1', position: 1, team1Id: 'a', nextMatchId: 'next', nextMatchSlot: 1, status: 'pending', isBye: true },
    { id: 'next', tournamentId: 'cup', round: 2, roundName: 'Полуфинал', position: 1, team2Id: 'b', status: 'pending' }
  ]
  const result = progressBracket(matches, 'bye', 'a')
  assert.equal(result.matches[0]?.status, 'finished')
  assert.equal(result.matches[1]?.team1Id, 'a')
  assert.deepEqual(result.readyMatchIds, ['next'])
})
