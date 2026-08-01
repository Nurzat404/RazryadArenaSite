import { useAuthStore } from '~/stores/auth'

const workspaceSections = ['/teams', '/tournaments', '/matches', '/ratings']

export default defineNuxtRouteMiddleware(async (to) => {
  const isWorkspaceRoute = to.path === '/'
    || workspaceSections.some((section) => to.path === section || to.path.startsWith(`${section}/`))

  if (!isWorkspaceRoute) {
    return
  }

  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.loadCurrentUser()
  }

  setPageLayout(auth.isAuthenticated ? 'app' : 'default')
})
