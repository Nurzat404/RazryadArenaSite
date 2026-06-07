import { mockUsers } from '~/data/mock/users'
import type { SportKey, User } from '~/types/domain'

export interface RegisterPayload {
  name: string
  email: string
  password: string
  city?: string
  age?: number
  favoriteSports: SportKey[]
  steamId?: string
}

let mockSessionUser: User | null = null

export const authService = {
  async login(email: string, _password: string) {
    mockSessionUser = mockUsers.find((user) => user.email === email) ?? mockUsers[0]
    return mockSessionUser
  },

  async currentUser() {
    return mockSessionUser ?? mockUsers[0]
  },

  async register(payload: RegisterPayload): Promise<User> {
    mockSessionUser = {
      id: 'mock-new-user',
      name: payload.name,
      email: payload.email,
      city: payload.city,
      age: payload.age,
      role: 'player',
      favoriteSports: payload.favoriteSports,
      emailVerified: false,
      steamId: payload.steamId
    }

    return mockSessionUser
  },

  async logout() {
    mockSessionUser = null
  },

  async requestPasswordReset(email: string) {
    return { email, sent: true }
  },

  async resetPassword(_token: string, _password: string) {
    return { success: true }
  },

  async verifyEmail(_token: string) {
    return { success: true }
  }
}
