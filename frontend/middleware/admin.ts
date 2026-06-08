import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.loadCurrentUser()
  }

  if (!auth.isAdmin) {
    return navigateTo('/')
  }
})
