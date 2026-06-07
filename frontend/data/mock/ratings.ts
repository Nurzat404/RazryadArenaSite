import type { RatingRow, RatingSeason } from '~/types/domain'

export const mockRatingSeasons: RatingSeason[] = [
  {
    id: 'season1',
    title: 'Лето 2026',
    sport: 'cs2',
    startsAt: '2026-06-01',
    endsAt: '2026-08-31',
    active: true
  },
  {
    id: 'season2',
    title: 'Городской футбол 2026',
    sport: 'football',
    startsAt: '2026-05-01',
    endsAt: '2026-09-30',
    active: true
  },
  {
    id: 'season3',
    title: 'Волейбол после пар',
    sport: 'volleyball',
    startsAt: '2026-06-01',
    endsAt: '2026-06-30',
    active: true
  }
]

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
  },
  {
    id: 'r3',
    entityId: 't3',
    entityName: 'Dust Friends',
    entityType: 'team',
    sport: 'cs2',
    points: 131,
    position: 2
  },
  {
    id: 'r4',
    entityId: 'u3',
    entityName: 'Марат С.',
    entityType: 'player',
    sport: 'cs2',
    points: 127,
    position: 3
  },
  {
    id: 'r5',
    entityId: 't4',
    entityName: 'Северный блок',
    entityType: 'team',
    sport: 'volleyball',
    points: 96,
    position: 1
  }
]
