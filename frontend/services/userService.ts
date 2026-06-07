import { mockUsers } from '~/data/mock/users'
import type { SportKey, User, UserRole } from '~/types/domain'

export interface UserListFilters {
  role?: UserRole
  sport?: SportKey
  search?: string
}

export type UserProfilePayload = Partial<Pick<User, 'name' | 'email' | 'city' | 'age' | 'favoriteSports' | 'steamId'>>

export const userService = {
  async list(filters: UserListFilters = {}) {
    return mockUsers.filter((user) => {
      const matchesRole = filters.role ? user.role === filters.role : true
      const matchesSport = filters.sport ? user.favoriteSports.includes(filters.sport) : true
      const matchesSearch = filters.search
        ? `${user.name} ${user.email}`.toLowerCase().includes(filters.search.toLowerCase())
        : true

      return matchesRole && matchesSport && matchesSearch
    })
  },

  async getById(id: string) {
    return mockUsers.find((user) => user.id === id) ?? null
  },

  async updateProfile(id: string, payload: UserProfilePayload) {
    const user = mockUsers.find((item) => item.id === id)
    return user ? { ...user, ...payload } : null
  },

  async changeRole(id: string, role: UserRole) {
    const user = mockUsers.find((item) => item.id === id)
    return user ? { ...user, role } : null
  }
}
