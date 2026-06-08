export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.loadCurrentUser()
  }
})
