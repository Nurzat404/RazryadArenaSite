import test from 'node:test'
import assert from 'node:assert/strict'
import { mapVetoSequence, validateMapPool } from '../utils/mapVetoSequence.ts'

const compact = (format, poolSize = 7) => mapVetoSequence(format, poolSize).map((step) => `${step.team}:${step.actionType}`)

test('BO1 следует порядку Valve Major', () => {
  assert.deepEqual(compact('bo1'), [
    'team1:ban', 'team1:ban',
    'team2:ban', 'team2:ban', 'team2:ban',
    'team1:ban'
  ])
})

test('BO3 следует порядку Valve Major', () => {
  assert.deepEqual(compact('bo3'), [
    'team1:ban', 'team2:ban',
    'team1:pick', 'team2:pick',
    'team2:ban', 'team1:ban'
  ])
})

test('BO5 следует порядку BLAST', () => {
  assert.deepEqual(compact('bo5'), [
    'team1:ban', 'team2:ban',
    'team1:pick', 'team2:pick',
    'team1:pick', 'team2:pick'
  ])
})

test('BO3 с тремя картами сразу выбирает две карты и оставляет решающую', () => {
  assert.deepEqual(compact('bo3', 3), ['team1:pick', 'team2:pick'])
})

test('BO3 с десятью картами сохраняет стандартные пики и добавляет баны', () => {
  assert.deepEqual(compact('bo3', 10), [
    'team1:ban', 'team2:ban',
    'team1:pick', 'team2:pick',
    'team2:ban', 'team1:ban', 'team2:ban', 'team1:ban', 'team2:ban'
  ])
})

test('BO5 работает с минимальным пулом из пяти карт', () => {
  assert.deepEqual(compact('bo5', 5), [
    'team1:pick', 'team2:pick', 'team1:pick', 'team2:pick'
  ])
})

test('пул ограничен размером серии и десятью картами', () => {
  assert.equal(validateMapPool('bo3', ['A', 'B']), 'Для BO3 выберите от 3 до 10 карт.')
  assert.equal(validateMapPool('bo3', ['A', 'B', 'C']), null)
  assert.equal(validateMapPool('bo5', ['A', 'B', 'C', 'D']), 'Для BO5 выберите от 5 до 10 карт.')
  assert.equal(validateMapPool('bo1', Array.from({ length: 11 }, (_, index) => `Map ${index}`)), 'Для BO1 выберите от 1 до 10 карт.')
})

test('названия карт проверяются без учёта регистра', () => {
  assert.equal(validateMapPool('bo1', ['Mirage', 'mirage']), 'В пуле не должно быть повторяющихся карт.')
})
