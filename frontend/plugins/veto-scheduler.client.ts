import { vetoService } from '~/services'

export default defineNuxtPlugin(() => {
  const sync = () => void vetoService.syncScheduled()
  sync()
  const timer = window.setInterval(sync, 15_000)

  window.addEventListener('beforeunload', () => window.clearInterval(timer), { once: true })
})
