import { defineStore } from 'pinia'
import type { User } from '~/types/domain'
import { authService } from '~/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    isAdmin: (state) => state.user?.role === 'admin'
  },
  actions: {
    async loadCurrentUser() {
      this.user = await authService.currentUser()
    },
    async login(email: string, password: string) {
      this.user = await authService.login(email, password)
    },
    logout() {
      this.user = null
    }
  }
})
