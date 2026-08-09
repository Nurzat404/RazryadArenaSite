<script setup lang="ts">
import { vetoService, type VetoContext } from '~/services'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const auth = useAuthStore()
const matchId = String(route.params.id)
const context = ref<VetoContext | null>(null)
const busy = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | undefined

const refresh = async () => {
  context.value = await vetoService.getContext(matchId)
}

onMounted(async () => {
  await refresh()
  timer = setInterval(() => {
    now.value = Date.now()
    void refresh()
  }, 10_000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const session = computed(() => context.value?.session ?? null)
const currentTeam = computed(() => {
  if (!context.value || !session.value?.currentTeamId) return null
  return session.value.currentTeamId === context.value.team1.id ? context.value.team1 : context.value.team2
})
const currentCaptainId = computed(() => {
  if (!context.value || !session.value?.currentTeamId) return null
  return session.value.currentTeamId === context.value.team1.id ? context.value.team1CaptainId : context.value.team2CaptainId
})
const canMakeMove = computed(() => Boolean(auth.user && session.value?.status === 'active' && currentCaptainId.value === auth.user.id))
const matchTimeReached = computed(() => Boolean(context.value && Date.parse(context.value.match.scheduledAt) <= now.value))
const canAdminStart = computed(() => Boolean(auth.isAdmin && session.value?.status === 'pending' && context.value?.tournament.vetoLaunchMode === 'admin_start' && matchTimeReached.value))
const timeLeft = computed(() => {
  if (!session.value?.deadlineAt) return ''
  const ms = Math.max(0, Date.parse(session.value.deadlineAt) - now.value)
  const minutes = Math.floor(ms / 60_000)
  const seconds = Math.floor((ms % 60_000) / 1000)
  return `${minutes}:${String(seconds).padStart(2, '0')}`
})
const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    pending: 'Ожидает запуска', active: 'Пик/бан идёт', finished: 'Карты определены', cancelled: 'Veto отменён'
  }
  return session.value ? labels[session.value.status] : ''
})

const actionLabel = (type?: string) => type === 'ban' ? 'Запрещает' : type === 'pick' ? 'Выбирает' : type === 'start' ? 'Запуск' : type === 'reset' ? 'Сброс' : type === 'cancel' ? 'Отмена' : 'Определена'
const actionByMap = computed(() => new Map(
  (session.value?.actions ?? [])
    .filter((action) => action.map)
    .map((action) => [action.map.toLowerCase(), action])
))
const availableMapNames = computed(() => new Set(context.value?.availableMaps.map((map) => map.toLowerCase()) ?? []))
const mapState = (map: string) => {
  const action = actionByMap.value.get(map.toLowerCase())
  if (action?.type === 'ban') return 'ban'
  if (action?.type === 'pick') return 'pick'
  if (session.value?.finalMaps.includes(map) && !action) return 'decider'
  return 'available'
}
const mapStateLabel = (map: string) => {
  const state = mapState(map)
  if (state === 'ban') return 'Забанена'
  if (state === 'pick') return 'Выбрана'
  if (state === 'decider') return 'Решающая'
  return canMakeMove.value ? (session.value?.currentActionType === 'ban' ? 'Забанить' : 'Выбрать') : 'Доступна'
}
const mapTeamName = (map: string) => {
  const teamId = actionByMap.value.get(map.toLowerCase())?.teamId
  if (!context.value || !teamId) return ''
  return teamId === context.value.team1.id ? context.value.team1.name : context.value.team2.name
}

const run = async (action: () => Promise<unknown>, success = '') => {
  if (!auth.user || busy.value) return
  busy.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    await action()
    successMessage.value = success
    await refresh()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось выполнить действие.'
  } finally {
    busy.value = false
  }
}

useHead({
  title: 'Пик/бан карт',
  meta: [{ name: 'description', content: 'Пул карт, ход капитанов и итоговая серия CS2-матча.' }]
})
</script>

<template>
  <section class="section-padding workspace-page workspace-page--veto">
    <div class="container">
      <template v-if="context && session">
        <PageHead title="Пик/бан карт" :subtitle="`${context.tournament.name} · ${session.format.toUpperCase()}`" />

        <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
        <p v-if="successMessage" class="form-success" role="status">{{ successMessage }}</p>

        <section class="veto-match" aria-label="Участники veto">
          <NuxtLink class="veto-match__team" :to="`/teams/${context.team1.id}`">
            <span class="veto-match__slot">Команда 1</span>
            <strong>{{ context.team1.name }}</strong>
          </NuxtLink>
          <div class="veto-match__status">
            <StatusBadge :status="session.status" :label="statusLabel" />
            <strong>{{ session.format.toUpperCase() }}</strong>
          </div>
          <NuxtLink class="veto-match__team veto-match__team--right" :to="`/teams/${context.team2.id}`">
            <span class="veto-match__slot">Команда 2</span>
            <strong>{{ context.team2.name }}</strong>
          </NuxtLink>
        </section>

        <section v-if="auth.isAdmin" class="veto-admin-controls" aria-label="Управление veto">
          <div class="veto-admin-controls__title">
            <span>Управление матчем</span>
            <strong>{{ statusLabel }}</strong>
          </div>
          <div class="veto-admin-controls__actions">
            <button v-if="canAdminStart" class="cta-button cta-button-primary" type="button" :disabled="busy" @click="run(() => vetoService.start(matchId, auth.user!.id), 'Пик/бан запущен.')">Запустить</button>
            <button v-if="session.status !== 'finished'" class="cta-button cta-button-secondary" type="button" :disabled="busy" @click="run(() => vetoService.reset(matchId, auth.user!.id), 'Veto сброшен.')">Сбросить</button>
            <button v-if="!['finished', 'cancelled'].includes(session.status)" class="cta-button veto-danger-button" type="button" :disabled="busy" @click="run(() => vetoService.cancel(matchId, auth.user!.id), 'Veto отменён.')">Отменить</button>
            <NuxtLink class="veto-settings-link" :to="`/admin/tournaments/${context.tournament.id}/veto`">Настройки турнира</NuxtLink>
          </div>
          <div v-if="session.timeoutNotifiedAt" class="veto-timeout-actions">
            <strong>Время хода истекло</strong>
            <button class="cta-button cta-button-secondary" type="button" :disabled="busy" @click="run(() => vetoService.dismissTimeout(matchId, auth.user!.id), 'Команде дали ещё 5 минут.')">Дать ещё 5 минут</button>
            <button class="cta-button veto-danger-button" type="button" :disabled="busy" @click="run(() => vetoService.awardTimeoutTechnicalWin(matchId, auth.user!.id), 'Технический результат сохранён.')">Присудить тех. результат</button>
          </div>
        </section>

        <section v-if="session.status === 'active'" class="veto-turn" aria-live="polite">
          <div class="veto-turn__action">
            <span>{{ session.currentActionType === 'ban' ? 'Бан карты' : 'Выбор карты' }}</span>
            <strong>Ход команды {{ currentTeam?.name }}</strong>
            <p>{{ canMakeMove ? 'Выберите карту ниже.' : 'Ожидаем действие капитана.' }}</p>
          </div>
          <div class="veto-turn__clock">
            <span>Осталось</span>
            <strong>{{ timeLeft }}</strong>
          </div>
        </section>

        <section v-else-if="session.status === 'pending'" class="veto-note">
          <div>
            <strong>{{ matchTimeReached ? 'Ожидает запуска' : 'Пик/бан начнётся перед матчем' }}</strong>
            <p v-if="!matchTimeReached">Запуск станет доступен, когда наступит время матча.</p>
            <p v-else-if="context.tournament.vetoLaunchMode === 'admin_start'">Администратор получил уведомление и может запустить пик/бан.</p>
            <p v-else>Автоматический запуск выполняется.</p>
          </div>
        </section>

        <section v-else-if="session.status === 'cancelled'" class="veto-note veto-note--cancelled">
          <div><strong>Veto отменено</strong><p>Карты матча пока не определены.</p></div>
        </section>

        <section v-if="session.finalMaps.length" class="veto-final-maps" aria-labelledby="vetoFinalMapsTitle">
          <div class="veto-section-heading">
            <div>
              <span>Итог серии</span>
              <h2 id="vetoFinalMapsTitle">Карты матча</h2>
            </div>
          </div>
          <ol>
            <li v-for="(map, index) in session.finalMaps" :key="map"><span>{{ index + 1 }}</span><strong>{{ map }}</strong></li>
          </ol>
        </section>

        <div class="veto-workspace">
          <section class="veto-board" aria-labelledby="vetoPoolTitle">
            <div class="veto-section-heading">
              <div>
                <span>Пул карт</span>
                <h2 id="vetoPoolTitle">{{ canMakeMove ? (session.currentActionType === 'ban' ? 'Какую карту запретить?' : 'Какую карту выбрать?') : 'Карты veto' }}</h2>
              </div>
              <strong>{{ context.availableMaps.length }}/{{ session.mapPool.length }}</strong>
            </div>

            <div class="veto-map-grid">
              <button
                v-for="map in session.mapPool"
                :key="map"
                class="veto-map"
                :class="[`veto-map--${mapState(map)}`, { 'veto-map--actionable': canMakeMove && availableMapNames.has(map.toLowerCase()) }]"
                type="button"
                :disabled="!canMakeMove || !availableMapNames.has(map.toLowerCase()) || busy"
                @click="run(() => vetoService.addAction(matchId, auth.user!.id, map))"
              >
                <strong>{{ map }}</strong>
                <span>{{ mapStateLabel(map) }}</span>
                <small v-if="mapTeamName(map)">{{ mapTeamName(map) }}</small>
              </button>
            </div>
          </section>

          <section class="veto-history" aria-labelledby="vetoHistoryTitle">
            <div class="veto-section-heading">
              <div><span>Порядок действий</span><h2 id="vetoHistoryTitle">История</h2></div>
            </div>
            <ol v-if="session.actions.length" class="veto-history__list">
              <li v-for="(action, index) in session.actions" :key="action.id">
                <span>{{ index + 1 }}</span>
                <div>
                  <strong>{{ action.map || actionLabel(action.type) }}</strong>
                  <small>{{ action.map ? `${actionLabel(action.type)} · ` : '' }}{{ action.teamId === context.team1.id ? context.team1.name : action.teamId === context.team2.id ? context.team2.name : 'Администратор' }}</small>
                </div>
              </li>
            </ol>
            <p v-else class="veto-history__empty">История появится после первого действия.</p>
          </section>
        </div>

        <div class="match-detail-actions">
          <NuxtLink class="cta-button cta-button-secondary" :to="`/matches/${context.match.id}`">К матчу</NuxtLink>
        </div>
      </template>

      <div v-else class="empty-state-panel">
        <h1>Veto для этого матча недоступно</h1>
        <p>Пик/бан работает только для CS2-матчей турниров с включённым и корректно настроенным пулом карт.</p>
        <NuxtLink class="cta-button cta-button-primary" :to="`/matches/${matchId}`">К матчу</NuxtLink>
      </div>
    </div>
  </section>
</template>
