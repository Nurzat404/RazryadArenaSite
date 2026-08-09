import type { Cs2MatchFormat } from '../types/domain.ts'

export interface MapVetoStep {
  team: 'team1' | 'team2'
  actionType: 'ban' | 'pick'
}

export const validateMapPool = (format: Cs2MatchFormat, maps: string[]) => {
  const pool = maps.map((map) => map.trim()).filter(Boolean)
  const unique = new Set(pool.map((map) => map.toLowerCase()))
  if (pool.length !== unique.size) return 'В пуле не должно быть повторяющихся карт.'
  const minimum = Number(format.slice(2))
  if (pool.length < minimum || pool.length > 10) return `Для ${format.toUpperCase()} выберите от ${minimum} до 10 карт.`
  return null
}

const step = (team: MapVetoStep['team'], actionType: MapVetoStep['actionType']): MapVetoStep => ({ team, actionType })
const alternatingBans = (count: number, first: MapVetoStep['team']) => Array.from({ length: count }, (_, index) =>
  step(index % 2 === 0 ? first : first === 'team1' ? 'team2' : 'team1', 'ban'))

export const mapVetoSequence = (format: Cs2MatchFormat, poolSize = 7): MapVetoStep[] => {
  const targetMaps = Number(format.slice(2))
  const banCount = Math.max(poolSize - targetMaps, 0)

  if (format === 'bo1') {
    const valveOrder: MapVetoStep['team'][] = ['team1', 'team1', 'team2', 'team2', 'team2', 'team1']
    const bans = valveOrder.slice(0, banCount).map((team) => step(team, 'ban'))
    return [...bans, ...alternatingBans(Math.max(banCount - bans.length, 0), 'team2')]
  }

  if (format === 'bo3') {
    const openingBans = alternatingBans(Math.min(banCount, 2), 'team1')
    const closingBans = alternatingBans(Math.max(banCount - openingBans.length, 0), 'team2')
    return [
      ...openingBans,
      step('team1', 'pick'),
      step('team2', 'pick'),
      ...closingBans
    ]
  }

  return [
    ...alternatingBans(banCount, 'team1'),
    step('team1', 'pick'),
    step('team2', 'pick'),
    step('team1', 'pick'),
    step('team2', 'pick')
  ]
}
