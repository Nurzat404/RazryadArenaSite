import { useMockUsers } from '~/data/mock/state'
import type { SportKey, User, UserRole } from '~/types/domain'

export interface UserListFilters {
  role?: UserRole
  sport?: SportKey
  search?: string
}

export type UserProfilePayload = Partial<Pick<User, 'name' | 'email' | 'city' | 'age' | 'favoriteSports' | 'steamProfileUrl'>>

export const userService = {
  async list(filters: UserListFilters = {}) {
    return useMockUsers().value.filter((user) => {
      const matchesRole = filters.role ? user.role === filters.role : true
      const matchesSport = filters.sport ? user.favoriteSports.includes(filters.sport) : true
      const matchesSearch = filters.search
        ? `${user.name} ${user.email}`.toLowerCase().includes(filters.search.toLowerCase())
        : true

      return matchesRole && matchesSport && matchesSearch
    })
  },

  async getById(id: string) {
    return useMockUsers().value.find((user) => user.id === id) ?? null
  },

  async updateProfile(id: string, payload: UserProfilePayload) {
    const users = useMockUsers()
    const user = users.value.find((item) => item.id === id)
    if (!user) return null
    const updated = { ...user, ...payload }
    users.value = users.value.map((item) => item.id === id ? updated : item)
    return updated
  },

  async changeRole(id: string, role: UserRole) {
    const users = useMockUsers()
    const user = users.value.find((item) => item.id === id)
    if (!user) return null
    const updated = { ...user, role }
    users.value = users.value.map((item) => item.id === id ? updated : item)
    return updated
  }
}
