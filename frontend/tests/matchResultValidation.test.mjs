import test from 'node:test'
import assert from 'node:assert/strict'
import { validateMapSeries, validateVolleyballSets } from '../utils/matchResultValidation.ts'

test('принимает согласованный результат BO3', () => {
  assert.equal(validateMapSeries([
    { mapName: 'Mirage', score1: 13, score2: 8 },
    { mapName: 'Nuke', score1: 10, score2: 13 },
    { mapName: 'Ancient', score1: 13, score2: 11 }
  ], 3, 2, 1), null)
})

test('не принимает повтор карты и расхождение общего счёта', () => {
  assert.match(validateMapSeries([
    { mapName: 'Mirage', score1: 13, score2: 8 },
    { mapName: 'Mirage', score1: 13, score2: 7 }
  ], 3, 2, 0) ?? '', /несколько раз/)
  assert.match(validateMapSeries([
    { mapName: 'Mirage', score1: 13, score2: 8 }
  ], 1, 0, 1) ?? '', /совпадать/)
})

test('сверяет итог волейбольного матча со счетом по сетам', () => {
  const sets = [
    { setNo: 1, score1: 25, score2: 18 },
    { setNo: 2, score1: 21, score2: 25 },
    { setNo: 3, score1: 25, score2: 20 }
  ]
  assert.equal(validateVolleyballSets(sets, 2, 1), null)
  assert.match(validateVolleyballSets(sets, 2, 0) ?? '', /совпадать/)
})
