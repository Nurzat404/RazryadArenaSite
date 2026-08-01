import { useMockUsers } from '~/data/mock/state'
import type { SportKey, User } from '~/types/domain'
import type { UserProfilePayload } from '~/services/userService'

export interface RegisterPayload {
  name: string
  email: string
  password: string
  city?: string
  age?: number
  favoriteSports: SportKey[]
  steamProfileUrl?: string
}

const mockUserIdCookie = 'ra_mock_user_id'

const saveSession = (user: User) => {
  const userId = useCookie<string | null>(mockUserIdCookie, { sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 })
  userId.value = user.id
}

const clearSession = () => {
  const userId = useCookie<string | null>(mockUserIdCookie, { sameSite: 'lax' })
  const oldUser = useCookie<User | null>('ra_mock_user', { sameSite: 'lax' })
  userId.value = null
  oldUser.value = null
}

const readSession = () => {
  const userId = useCookie<string | null>(mockUserIdCookie, { sameSite: 'lax' })
  return useMockUsers().value.find((item) => item.id === userId.value) ?? null
}

export const authService = {
  async login(email: string, _password: string) {
    const user = useMockUsers().value.find((item) => item.email.toLowerCase() === email.toLowerCase())
    if (!user) throw new Error('User not found')
    saveSession(user)
    return user
  },

  async currentUser() {
    return readSession()
  },

  async updateCurrentUser(payload: UserProfilePayload) {
    const users = useMockUsers()
    const user = readSession()
    if (!user) return null
    const updatedUser = { ...user, ...payload }
    users.value = users.value.map((item) => item.id === user.id ? updatedUser : item)
    saveSession(updatedUser)
    return updatedUser
  },

  async register(payload: RegisterPayload): Promise<User> {
    const users = useMockUsers()
    if (users.value.some((item) => item.email.toLowerCase() === payload.email.toLowerCase())) {
      throw new Error('Email already exists')
    }

    const user: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: payload.name,
      email: payload.email,
      city: payload.city,
      age: payload.age,
      role: 'player',
      favoriteSports: payload.favoriteSports,
      emailVerified: false,
      steamProfileUrl: payload.steamProfileUrl
    }
    users.value = [...users.value, user]
    saveSession(user)
    return user
  },

  async logout() {
    clearSession()
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
