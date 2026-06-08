import { defineStore } from 'pinia'
import type { User } from '~/types/domain'
import { authService, type RegisterPayload } from '~/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    initialized: false
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    isAdmin: (state) => state.user?.role === 'admin'
  },
  actions: {
    async loadCurrentUser() {
      this.user = await authService.currentUser()
      this.initialized = true
    },
    async login(email: string, password: string) {
      this.user = await authService.login(email, password)
      this.initialized = true
    },
    async register(payload: RegisterPayload) {
      this.user = await authService.register(payload)
      this.initialized = true
    },
    async logout() {
      await authService.logout()
      this.user = null
      this.initialized = true
    }
  }
})
