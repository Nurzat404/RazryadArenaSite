import type { RatingRow } from '~/types/domain'

export const mockRatings: RatingRow[] = [
  {
    id: 'r1',
    entityId: 't1',
    entityName: 'Arena Five',
    entityType: 'team',
    sport: 'cs2',
    points: 142,
    position: 1
  },
  {
    id: 'r2',
    entityId: 't2',
    entityName: 'Ural Kickers',
    entityType: 'team',
    sport: 'football',
    points: 118,
    position: 2
  }
]
