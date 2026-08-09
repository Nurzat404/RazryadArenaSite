<script setup lang="ts">
import { tournamentService, vetoService, type VetoContext } from '~/services'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const auth = useAuthStore()
const tournamentId = String(route.params.id)
const tournament = ref<Awaited<ReturnType<typeof tournamentService.getById>>>(null)
const sessions = ref<VetoContext[]>([])
const enabled = ref(false)
const launchMode = ref<'admin_start' | 'auto_start'>('admin_start')
const selectedMaps = ref<string[]>([])
const busy = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const customMapName = ref('')
const customMapError = ref('')

const standardMapOptions = ['Ancient', 'Anubis', 'Dust II', 'Inferno', 'Mirage', 'Nuke', 'Overpass', 'Train', 'Vertigo', 'Cache']
const mapOptions = computed(() => [...new Set([...standardMapOptions, ...selectedMaps.value])])
const minimumPoolSize = computed(() => {
  if (!tournament.value) return 1
  const formats = tournament.value.stageMatchFormats
    ? Object.values(tournament.value.stageMatchFormats)
    : [tournament.value.matchFormat.match(/BO([135])/i)?.[1] ?? '1']
  return Math.max(...formats.map((format) => Number(String(format).replace(/\D/g, '')) || 1))
})

const addCustomMap = () => {
  const name = customMapName.value.trim()
  customMapError.value = ''
  if (!name) return
  if (name.length > 40) {
    customMapError.value = 'Название должно быть короче 40 символов.'
    return
  }
  if (selectedMaps.value.some((map) => map.toLowerCase() === name.toLowerCase())) {
    customMapError.value = 'Такая карта уже добавлена.'
    return
  }
  if (selectedMaps.value.length >= 10) {
    customMapError.value = 'В пуле может быть не больше 10 карт.'
    return
  }
  selectedMaps.value = [...selectedMaps.value, name]
  customMapName.value = ''
}

const refresh = async () => {
  tournament.value = await tournamentService.getById(tournamentId)
  if (tournament.value?.sport === 'cs2') {
    enabled.value = Boolean(tournament.value.mapVetoEnabled)
    launchMode.value = tournament.value.vetoLaunchMode ?? 'admin_start'
    selectedMaps.value = tournament.value.mapPool ? [...tournament.value.mapPool] : []
    sessions.value = await vetoService.listByTournament(tournamentId)
  }
}

onMounted(() => void refresh())

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

const sessionLabel = (item: VetoContext) => {
  if (item.session.status === 'pending' && item.tournament.vetoLaunchMode === 'admin_start' && Date.parse(item.match.scheduledAt) <= Date.now()) return 'Требуется запуск'
  return ({ pending: 'Ожидает запуска', active: 'Пик/бан идёт', finished: 'Карты определены', cancelled: 'Отменён' }[item.session.status] ?? item.session.status)
}

useHead({
  title: 'Настройка Map Veto',
  meta: [{ name: 'description', content: 'Настройка пула карт и управление CS2 pick/ban матчами турнира.' }]
})
</script>

<template>
  <section>
    <template v-if="tournament?.sport === 'cs2'">
      <PageHead :title="`Map Veto: ${tournament.name}`" subtitle="Пул карт и текущие pick/ban матчей." />

      <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
      <p v-if="successMessage" class="form-success" role="status">{{ successMessage }}</p>

      <form class="form-panel veto-settings" @submit.prevent="run(() => vetoService.updateTournamentSettings(tournamentId, { enabled, launchMode, mapPool: selectedMaps }, auth.user!.id), 'Настройки сохранены.')">
        <div class="veto-settings__head">
          <div>
            <h2>Настройки veto</h2>
            <p v-if="tournament.stageMatchFormats">
              Ранние раунды {{ tournament.stageMatchFormats.earlyRound.toUpperCase() }}, полуфинал {{ tournament.stageMatchFormats.semifinal.toUpperCase() }}, финал {{ tournament.stageMatchFormats.final.toUpperCase() }}.
            </p>
            <p v-else>Формат матчей: {{ tournament.matchFormat.match(/BO[135]/i)?.[0]?.toUpperCase() ?? 'BO3' }}.</p>
          </div>
          <label class="veto-toggle">
            <input v-model="enabled" type="checkbox">
            <span class="veto-toggle__track" aria-hidden="true"></span>
            <span>Veto включено</span>
          </label>
        </div>

        <fieldset :disabled="!enabled || busy">
          <span class="form-label">Как запускать</span>
          <div class="veto-mode-control" role="radiogroup" aria-label="Режим запуска veto">
            <label class="veto-mode-option" :class="{ 'is-active': launchMode === 'admin_start' }">
              <input v-model="launchMode" type="radio" value="admin_start">
              <strong>Вручную</strong>
              <span>В назначенное время администратор получает уведомление и запускает veto в матче</span>
            </label>
            <label class="veto-mode-option" :class="{ 'is-active': launchMode === 'auto_start' }">
              <input v-model="launchMode" type="radio" value="auto_start">
              <strong>Автоматически</strong>
              <span>Veto запускается сразу, когда наступает время матча</span>
            </label>
          </div>

          <span class="form-label">Пул карт</span>
          <div class="veto-settings__maps">
            <label v-for="map in mapOptions" :key="map" class="veto-pool-option" :class="{ 'is-selected': selectedMaps.includes(map) }">
              <input v-model="selectedMaps" type="checkbox" :value="map" :disabled="!selectedMaps.includes(map) && selectedMaps.length >= 10">
              <span>{{ map }}</span>
            </label>
          </div>
          <p class="form-hint">Для текущих форматов нужно от {{ minimumPoolSize }} до 10 карт.</p>

          <label class="form-label" for="customMapName">Своя карта</label>
          <div class="veto-custom-map">
            <input id="customMapName" v-model="customMapName" class="form-control" type="text" maxlength="40" placeholder="Название карты" @keydown.enter.prevent="addCustomMap">
            <button class="cta-button cta-button-secondary" type="button" :disabled="busy || selectedMaps.length >= 10" @click="addCustomMap">Добавить</button>
          </div>
          <p v-if="customMapError" class="form-error" role="alert">{{ customMapError }}</p>
        </fieldset>

        <button class="cta-button cta-button-primary" type="submit" :disabled="busy">Сохранить</button>
      </form>

      <section class="veto-admin-list" aria-labelledby="vetoMatchesTitle">
        <div class="veto-admin-list__head">
          <div>
            <span>Матчи турнира</span>
            <h2 id="vetoMatchesTitle">Pick/ban по матчам</h2>
          </div>
        </div>

        <div v-if="sessions.length" class="veto-admin-list__rows">
          <article v-for="item in sessions" :key="item.session.id" class="veto-admin-row">
            <div class="veto-admin-row__match">
              <NuxtLink :to="`/matches/${item.match.id}`">{{ item.team1.name }} <span>vs</span> {{ item.team2.name }}</NuxtLink>
              <small>{{ item.session.format.toUpperCase() }} · {{ item.session.finalMaps.length ? item.session.finalMaps.join(', ') : 'Карты ещё не выбраны' }}</small>
            </div>
            <StatusBadge :status="item.session.status" :label="sessionLabel(item)" />
            <NuxtLink class="cta-button cta-button-secondary" :to="`/matches/${item.match.id}/veto`">Открыть матч</NuxtLink>
          </article>
        </div>
        <p v-else class="veto-history__empty">Пары для pick/ban появятся, когда в CS2-сетке будут определены обе команды.</p>
      </section>
    </template>

    <div v-else-if="tournament" class="empty-state-panel">
      <h1>Map Veto доступен только для CS2</h1>
      <p>У этого турнира другой вид спорта, поэтому пул карт ему не нужен.</p>
      <NuxtLink class="cta-button cta-button-primary" to="/admin/tournaments">К турнирам</NuxtLink>
    </div>

    <div v-else class="empty-state-panel">
      <h1>Турнир не найден</h1>
      <p>Откройте нужный турнир из списка в админке.</p>
    </div>
  </section>
</template>
