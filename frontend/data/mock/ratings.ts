import type { RatingRow, RatingSeason } from '~/types/domain'

export const mockRatingSeasons: RatingSeason[] = [
  {
    id: 'cs2-season-2',
    title: 'Лето 2026',
    sport: 'cs2',
    sequenceNo: 2,
    startsAt: '2026-06-01',
    endsAt: '2026-08-31',
    active: true
  },
  {
    id: 'cs2-season-1',
    title: 'Весна 2026',
    sport: 'cs2',
    sequenceNo: 1,
    startsAt: '2026-03-01',
    endsAt: '2026-05-31',
    active: false
  },
  {
    id: 'football-season-2',
    title: 'Городской футбол 2026',
    sport: 'football',
    sequenceNo: 2,
    startsAt: '2026-05-01',
    endsAt: '2026-09-30',
    active: true
  },
  {
    id: 'football-season-1',
    title: 'Весенний круг',
    sport: 'football',
    sequenceNo: 1,
    startsAt: '2026-03-10',
    endsAt: '2026-04-30',
    active: false
  },
  {
    id: 'volleyball-season-2',
    title: 'Волейбол после пар',
    sport: 'volleyball',
    sequenceNo: 2,
    startsAt: '2026-06-01',
    endsAt: '2026-06-30',
    active: true
  },
  {
    id: 'volleyball-season-1',
    title: 'Майские игры',
    sport: 'volleyball',
    sequenceNo: 1,
    startsAt: '2026-05-01',
    endsAt: '2026-05-31',
    active: false
  }
]

export const mockRatings: RatingRow[] = [
  {
    id: 'overall-team-1',
    entityId: 't1',
    entityName: 'Arena Five',
    entityType: 'team',
    sport: 'cs2',
    ratingScope: 'overall',
    points: 276,
    position: 1
  },
  {
    id: 'overall-team-2',
    entityId: 't3',
    entityName: 'Dust Friends',
    entityType: 'team',
    sport: 'cs2',
    ratingScope: 'overall',
    points: 241,
    position: 2
  },
  {
    id: 'overall-team-3',
    entityId: 't2',
    entityName: 'Ural Kickers',
    entityType: 'team',
    sport: 'football',
    ratingScope: 'overall',
    points: 198,
    position: 3
  },
  {
    id: 'overall-team-4',
    entityId: 't4',
    entityName: 'Северный блок',
    entityType: 'team',
    sport: 'volleyball',
    ratingScope: 'overall',
    points: 162,
    position: 4
  },
  {
    id: 'overall-player-1',
    entityId: 'u3',
    entityName: 'Марат С.',
    entityType: 'player',
    sport: 'cs2',
    ratingScope: 'overall',
    points: 214,
    position: 1
  },
  {
    id: 'overall-player-2',
    entityId: 'u1',
    entityName: 'Нурзат А.',
    entityType: 'player',
    sport: 'cs2',
    ratingScope: 'overall',
    points: 185,
    position: 2
  },
  {
    id: 'cs2-s2-team-1',
    entityId: 't1',
    entityName: 'Arena Five',
    entityType: 'team',
    sport: 'cs2',
    ratingScope: 'seasonal',
    seasonId: 'cs2-season-2',
    points: 142,
    position: 1
  },
  {
    id: 'cs2-s2-team-2',
    entityId: 't3',
    entityName: 'Dust Friends',
    entityType: 'team',
    sport: 'cs2',
    ratingScope: 'seasonal',
    seasonId: 'cs2-season-2',
    points: 131,
    position: 2
  },
  {
    id: 'cs2-s2-player-1',
    entityId: 'u3',
    entityName: 'Марат С.',
    entityType: 'player',
    sport: 'cs2',
    ratingScope: 'seasonal',
    seasonId: 'cs2-season-2',
    points: 127,
    position: 1
  },
  {
    id: 'cs2-s1-team-1',
    entityId: 't3',
    entityName: 'Dust Friends',
    entityType: 'team',
    sport: 'cs2',
    ratingScope: 'seasonal',
    seasonId: 'cs2-season-1',
    points: 110,
    position: 1
  },
  {
    id: 'football-s2-team-1',
    entityId: 't2',
    entityName: 'Ural Kickers',
    entityType: 'team',
    sport: 'football',
    ratingScope: 'seasonal',
    seasonId: 'football-season-2',
    points: 118,
    position: 1
  },
  {
    id: 'football-s1-team-1',
    entityId: 't2',
    entityName: 'Ural Kickers',
    entityType: 'team',
    sport: 'football',
    ratingScope: 'seasonal',
    seasonId: 'football-season-1',
    points: 80,
    position: 1
  },
  {
    id: 'volleyball-s2-team-1',
    entityId: 't4',
    entityName: 'Северный блок',
    entityType: 'team',
    sport: 'volleyball',
    ratingScope: 'seasonal',
    seasonId: 'volleyball-season-2',
    points: 96,
    position: 1
  },
  {
    id: 'volleyball-s1-team-1',
    entityId: 't4',
    entityName: 'Северный блок',
    entityType: 'team',
    sport: 'volleyball',
    ratingScope: 'seasonal',
    seasonId: 'volleyball-season-1',
    points: 74,
    position: 1
  }
]
