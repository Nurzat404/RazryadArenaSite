import type { User } from '~/types/domain'

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Нурзат А.',
    email: 'nurz@example.com',
    city: 'Екатеринбург',
    age: 20,
    role: 'admin',
    favoriteSports: ['cs2', 'football'],
    emailVerified: false,
    steamId: '76561198000000000'
  },
  {
    id: 'u2',
    name: 'Алексей К.',
    email: 'alex@example.com',
    city: 'Екатеринбург',
    age: 21,
    role: 'captain',
    favoriteSports: ['cs2'],
    emailVerified: true
  },
  {
    id: 'u3',
    name: 'Марат С.',
    email: 'marat@example.com',
    city: 'Екатеринбург',
    age: 19,
    role: 'player',
    favoriteSports: ['cs2', 'basketball'],
    emailVerified: true,
    steamId: '76561198000000003'
  },
  {
    id: 'u4',
    name: 'Дана Р.',
    email: 'dana@example.com',
    city: 'Екатеринбург',
    age: 22,
    role: 'tournament_manager',
    favoriteSports: ['football', 'volleyball'],
    emailVerified: true
  },
  {
    id: 'u5',
    name: 'Илья П.',
    email: 'ilya@example.com',
    city: 'Онлайн',
    age: 18,
    role: 'player',
    favoriteSports: ['cs2'],
    emailVerified: false,
    steamId: '76561198000000005'
  },
  {
    id: 'u6',
    name: 'Айгуль М.',
    email: 'aigul@example.com',
    city: 'Екатеринбург',
    age: 20,
    role: 'captain',
    favoriteSports: ['volleyball'],
    emailVerified: true
  }
]
