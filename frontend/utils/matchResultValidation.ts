import type { MatchMapResult, VolleyballSetScore } from '../types/domain'

export const requiredSeriesWins = (bestOf: number) => Math.floor(bestOf / 2) + 1

export const validateMapSeries = (
  maps: MatchMapResult[],
  bestOf: number,
  score1: number,
  score2: number
): string | null => {
  const played = maps.filter((map) => map.score1 > 0 || map.score2 > 0)
  const requiredWins = requiredSeriesWins(bestOf)

  if (!played.length) return 'Укажите счёт хотя бы одной карты.'
  if (played.length > bestOf) return `В формате BO${bestOf} нельзя сыграть больше ${bestOf} карт.`
  if (new Set(played.map((map) => map.mapName)).size !== played.length) return 'Одна карта выбрана несколько раз.'
  if (played.some((map) => map.score1 === map.score2)) return 'На каждой сыгранной карте должен быть победитель.'

  const mapScore1 = played.filter((map) => map.score1 > map.score2).length
  const mapScore2 = played.filter((map) => map.score2 > map.score1).length
  if (mapScore1 !== score1 || mapScore2 !== score2) return 'Итоговый счёт должен совпадать с результатами карт.'
  if (Math.max(mapScore1, mapScore2) !== requiredWins || Math.min(mapScore1, mapScore2) >= requiredWins) {
    return `Для победы в BO${bestOf} нужно выиграть ${requiredWins} карт.`
  }
  return null
}

export const validateVolleyballSets = (
  sets: VolleyballSetScore[],
  score1: number,
  score2: number
): string | null => {
  const played = sets.filter((set) => set.score1 > 0 || set.score2 > 0)
  if (!played.length) return 'Укажите счёт сыгранных сетов.'
  if (played.some((set) => set.score1 === set.score2)) return 'В каждом сыгранном сете должен быть победитель.'

  const setScore1 = played.filter((set) => set.score1 > set.score2).length
  const setScore2 = played.filter((set) => set.score2 > set.score1).length
  return setScore1 === score1 && setScore2 === score2
    ? null
    : 'Итоговый счёт должен совпадать со счётом по сетам.'
}
