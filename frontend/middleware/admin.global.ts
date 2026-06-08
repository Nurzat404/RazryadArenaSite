export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) {
    return
  }

  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.loadCurrentUser()
  }

  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }

  if (!auth.isAdmin) {
    return navigateTo('/')
  }
})
