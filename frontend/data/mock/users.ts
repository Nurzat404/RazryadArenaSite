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
  }
]
