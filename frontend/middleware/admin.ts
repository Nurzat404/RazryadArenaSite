import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()

  if (!auth.user) {
    await auth.loadCurrentUser()
  }

  if (!auth.isAdmin) {
    return navigateTo('/')
  }
})
