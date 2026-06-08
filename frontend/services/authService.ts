import { mockUsers } from '~/data/mock/users'
import type { SportKey, User } from '~/types/domain'
import type { UserProfilePayload } from '~/services/userService'

export interface RegisterPayload {
  name: string
  email: string
  password: string
  city?: string
  age?: number
  favoriteSports: SportKey[]
  steamId?: string
}

const mockUserIdCookie = 'ra_mock_user_id'
const mockUserCookie = 'ra_mock_user'

const saveSession = (user: User, persistSnapshot = false) => {
  const userId = useCookie<string | null>(mockUserIdCookie, { sameSite: 'lax' })
  const customUser = useCookie<User | null>(mockUserCookie, { sameSite: 'lax' })

  userId.value = user.id
  customUser.value = persistSnapshot || !mockUsers.some((item) => item.id === user.id) ? user : null
}

const clearSession = () => {
  const userId = useCookie<string | null>(mockUserIdCookie, { sameSite: 'lax' })
  const customUser = useCookie<User | null>(mockUserCookie, { sameSite: 'lax' })

  userId.value = null
  customUser.value = null
}

const readSession = () => {
  const userId = useCookie<string | null>(mockUserIdCookie, { sameSite: 'lax' })
  const customUser = useCookie<User | null>(mockUserCookie, { sameSite: 'lax' })

  return customUser.value ?? mockUsers.find((item) => item.id === userId.value) ?? null
}

export const authService = {
  async login(email: string, _password: string) {
    const user = mockUsers.find((item) => item.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      throw new Error('User not found')
    }

    saveSession(user)
    return user
  },

  async currentUser() {
    return readSession()
  },

  async updateCurrentUser(payload: UserProfilePayload) {
    const user = readSession()

    if (!user) {
      return null
    }

    const updatedUser = {
      ...user,
      ...payload
    }

    saveSession(updatedUser, true)
    return updatedUser
  },

  async register(payload: RegisterPayload): Promise<User> {
    const user: User = {
      id: `mock-user-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      city: payload.city,
      age: payload.age,
      role: 'player',
      favoriteSports: payload.favoriteSports,
      emailVerified: false,
      steamId: payload.steamId
    }

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
