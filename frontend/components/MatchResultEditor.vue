<script setup lang="ts">
import { matchResultService, matchService, teamService, tournamentService, userService } from '~/services'
import { useMockTournamentRosters } from '~/data/mock/state'
import type { MatchMapResult, PlayerMatchStat, SportKey, VolleyballSetScore } from '~/types/domain'

const props = defineProps<{ matchId: string }>()
const auth = useAuthStore()

const match = await matchService.getById(props.matchId)
const [tournament, teams, users, savedDetails] = await Promise.all([
  match ? tournamentService.getById(match.tournamentId) : null,
  teamService.list(),
  userService.list(),
  matchResultService.getByMatchId(props.matchId)
])

const teamById = new Map(teams.map((team) => [team.id, team]))
const team1 = match ? teamById.get(match.team1Id) : null
const team2 = match ? teamById.get(match.team2Id) : null
const rosters = match ? useMockTournamentRosters().value.filter((roster) => (
  roster.tournamentId === match.tournamentId && [match.team1Id, match.team2Id].includes(roster.teamId)
)) : []
const participantIds = [...new Set(rosters.flatMap((roster) => roster.playerIds).length
  ? rosters.flatMap((roster) => roster.playerIds)
  : [...(team1?.memberIds ?? []), ...(team2?.memberIds ?? [])])]
const participants = users.filter((user) => participantIds.includes(user.id))

type StatFormRow = { userId: string } & Record<string, number>
type StatField = { key: string, label: string, step?: string, max?: number }

const sportStatFields: Record<SportKey, StatField[]> = {
  cs2: [
    { key: 'kills', label: 'Убийства' },
    { key: 'deaths', label: 'Смерти' },
    { key: 'assists', label: 'Ассисты' },
    { key: 'adr', label: 'ADR', step: '0.1' },
    { key: 'headshotPercent', label: 'HS, %', step: '0.1', max: 100 },
    { key: 'playerRating', label: 'Rating 3.0', step: '0.01' }
  ],
  football: [
    { key: 'goals', label: 'Голы' },
    { key: 'assists', label: 'Голевые передачи' }
  ],
  basketball: [
    { key: 'points', label: 'Очки' },
    { key: 'fouls', label: 'Фолы' }
  ],
  volleyball: [
    { key: 'points', label: 'Очки' },
    { key: 'aces', label: 'Эйсы' }
  ]
}

const score1 = ref(match?.score1 ?? 0)
const score2 = ref(match?.score2 ?? 0)
const winnerId = ref(match?.winnerId ?? '')
const technical = ref(Boolean(savedDetails?.technicalReason))
const technicalWinnerId = ref(match?.winnerId ?? '')
const technicalReason = ref(savedDetails?.technicalReason ?? '')
const mvpUserId = ref(savedDetails?.mvpUserId ?? '')
const submitError = ref('')
const saving = ref(false)
const isCs2 = computed(() => match?.sport === 'cs2')
const isVolleyball = computed(() => match?.sport === 'volleyball')
const seriesLength = computed(() => {
  const format = tournament?.matchFormat.match(/BO([135])/i)?.[1]
  return Number(format ?? 1)
})
const mapPool = tournament?.mapPool?.length ? tournament.mapPool : ['Карта уточняется']
const mapResults = ref<MatchMapResult[]>(savedDetails?.mapResults.length
  ? savedDetails.mapResults.map((item) => ({ ...item }))
  : Array.from({ length: seriesLength.value }, (_, index) => ({
    mapName: mapPool[index] ?? `Карта ${index + 1}`,
    score1: 0,
    score2: 0
  })))
const volleyballSets = ref<VolleyballSetScore[]>(savedDetails?.volleyballSets.length
  ? savedDetails.volleyballSets.map((item) => ({ ...item }))
  : Array.from({ length: 5 }, (_, index) => ({ setNo: index + 1, score1: 0, score2: 0 })))
const playerStats = ref<StatFormRow[]>(participants.map((player) => {
  const savedStat = savedDetails?.playerStats.find((item) => item.userId === player.id)
  return { userId: player.id, ...(savedStat ?? {}) } as StatFormRow
}))

const teamName = (teamId: string) => teamById.get(teamId)?.name ?? 'Команда'
const submit = async () => {
  submitError.value = ''
  if (!match) return

  let selectedWinnerId = winnerId.value
  let finalScore1 = score1.value
  let finalScore2 = score2.value

  if (technical.value) {
    if (!technicalWinnerId.value || !technicalReason.value.trim()) {
      submitError.value = 'Укажите победителя и причину технического результата.'
      return
    }
    selectedWinnerId = technicalWinnerId.value
    finalScore1 = selectedWinnerId === match.team1Id ? 1 : 0
    finalScore2 = selectedWinnerId === match.team2Id ? 1 : 0
    if (!window.confirm(`Подтвердить технический результат ${finalScore1}:${finalScore2}?`)) return
  } else if (!selectedWinnerId || score1.value === score2.value) {
    submitError.value = 'Укажите счёт и выберите победителя.'
    return
  }

  const detailsStats = playerStats.value.map(({ userId, ...stats }) => ({ userId, ...stats })) as PlayerMatchStat[]
  saving.value = true
  try {
    await matchResultService.submit(match.id, {
      score1: finalScore1,
      score2: finalScore2,
      winnerId: selectedWinnerId,
      technicalReason: technical.value ? technicalReason.value.trim() : undefined,
      mapResults: isCs2.value && !technical.value ? mapResults.value : [],
      volleyballSets: isVolleyball.value && !technical.value ? volleyballSets.value : [],
      playerStats: detailsStats,
      mvpUserId: mvpUserId.value || undefined
    }, auth.user?.id)
    await navigateTo({ path: `/matches/${match.id}`, query: { result: 'saved' } })
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : 'Не получилось сохранить результат.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div v-if="match && tournament" class="match-result-editor">
    <section class="match-result-editor__match">
      <span>{{ tournament.name }}</span>
      <strong>{{ teamName(match.team1Id) }} <b>—</b> {{ teamName(match.team2Id) }}</strong>
    </section>

    <form class="form-panel match-result-editor__form" @submit.prevent="submit">
      <section class="form-section">
        <h2 class="form-section__title">Итог матча</h2>
        <div class="match-result-editor__score">
          <label class="form-label">
            <span>{{ teamName(match.team1Id) }}</span>
            <input v-model.number="score1" class="form-control" type="number" min="0" :disabled="technical">
          </label>
          <b>:</b>
          <label class="form-label">
            <span>{{ teamName(match.team2Id) }}</span>
            <input v-model.number="score2" class="form-control" type="number" min="0" :disabled="technical">
          </label>
        </div>
        <div v-if="!technical" class="match-result-editor__technical-fields">
          <label class="form-label" for="regularWinner">Победитель</label>
          <select id="regularWinner" v-model="winnerId" class="form-select" required>
            <option disabled value="">Выберите команду</option>
            <option :value="match.team1Id">{{ teamName(match.team1Id) }}</option>
            <option :value="match.team2Id">{{ teamName(match.team2Id) }}</option>
          </select>
        </div>
        <label class="match-result-editor__technical">
          <input v-model="technical" type="checkbox">
          <span>Технический результат</span>
        </label>
        <div v-if="technical" class="match-result-editor__technical-fields">
          <label class="form-label" for="technicalWinner">Победитель</label>
          <select id="technicalWinner" v-model="technicalWinnerId" class="form-select">
            <option disabled value="">Выберите команду</option>
            <option :value="match.team1Id">{{ teamName(match.team1Id) }}</option>
            <option :value="match.team2Id">{{ teamName(match.team2Id) }}</option>
          </select>
          <label class="form-label" for="technicalReason">Причина</label>
          <textarea id="technicalReason" v-model="technicalReason" class="form-control" rows="3" placeholder="Например, команда не пришла к началу матча"></textarea>
        </div>
      </section>

      <section v-if="isCs2 && !technical" class="form-section">
        <h2 class="form-section__title">Карты CS2</h2>
        <div class="match-result-editor__series">
          <div v-for="(map, index) in mapResults" :key="index" class="match-result-editor__series-row">
            <select v-model="map.mapName" class="form-select" :aria-label="`Карта ${index + 1}`">
              <option v-for="mapName in mapPool" :key="mapName" :value="mapName">{{ mapName }}</option>
            </select>
            <input v-model.number="map.score1" class="form-control" type="number" min="0" :aria-label="`${teamName(match.team1Id)}, карта ${index + 1}`">
            <b>:</b>
            <input v-model.number="map.score2" class="form-control" type="number" min="0" :aria-label="`${teamName(match.team2Id)}, карта ${index + 1}`">
          </div>
        </div>
      </section>

      <section v-if="isVolleyball && !technical" class="form-section">
        <h2 class="form-section__title">Сеты</h2>
        <div class="match-result-editor__series">
          <div v-for="set in volleyballSets" :key="set.setNo" class="match-result-editor__series-row">
            <span>Сет {{ set.setNo }}</span>
            <input v-model.number="set.score1" class="form-control" type="number" min="0" :aria-label="`${teamName(match.team1Id)}, сет ${set.setNo}`">
            <b>:</b>
            <input v-model.number="set.score2" class="form-control" type="number" min="0" :aria-label="`${teamName(match.team2Id)}, сет ${set.setNo}`">
          </div>
        </div>
      </section>

      <section v-if="participants.length" class="form-section">
        <h2 class="form-section__title">Статистика игроков</h2>
        <div class="match-result-editor__stats">
          <div v-for="stat in playerStats" :key="stat.userId" class="match-result-editor__player">
            <strong>{{ users.find((user) => user.id === stat.userId)?.name ?? 'Игрок' }}</strong>
            <label v-for="field in sportStatFields[match.sport]" :key="field.key" class="form-label">
              <span>{{ field.label }}</span>
              <input v-model.number="stat[field.key]" class="form-control" type="number" min="0" :max="field.max" :step="field.step ?? '1'">
            </label>
          </div>
        </div>
        <label class="form-label match-result-editor__mvp" for="matchMvp">MVP матча <span class="text-muted-strong">(по желанию)</span></label>
        <select id="matchMvp" v-model="mvpUserId" class="form-select">
          <option value="">Не выбран</option>
          <option v-for="player in participants" :key="player.id" :value="player.id">{{ player.name }}</option>
        </select>
      </section>

      <p v-if="submitError" class="form-error" role="alert">{{ submitError }}</p>
      <div class="profile-form-actions">
        <button class="cta-button cta-button-primary" type="submit" :disabled="saving">
          {{ saving ? 'Сохраняем...' : savedDetails ? 'Сохранить изменения' : 'Сохранить результат' }}
        </button>
        <NuxtLink class="cta-button cta-button-secondary" :to="`/matches/${match.id}`">Отмена</NuxtLink>
      </div>
    </form>
  </div>

  <div v-else class="empty-state-panel">
    <h1>Матч не найден</h1>
    <p>Проверьте ссылку и попробуйте открыть матч из расписания или сетки.</p>
  </div>
</template>
