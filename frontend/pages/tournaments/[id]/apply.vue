<script setup lang="ts">
import { applicationService, teamService, tournamentService, userService } from '~/services'
import type { ApplicationCheck } from '~/services/applicationService'

definePageMeta({ layout: 'app', middleware: 'auth' })

const route = useRoute()
const auth = useAuthStore()
if (!auth.initialized) await auth.loadCurrentUser()

const tournamentId = String(route.params.id)
const tournament = await tournamentService.getById(tournamentId)
const [userTeams, users] = await Promise.all([
  auth.user ? teamService.listByUser(auth.user.id) : [],
  userService.list()
])
const captainTeams = tournament && auth.user
  ? userTeams.filter((team) => team.captainId === auth.user!.id && team.sport === tournament.sport)
  : []
const memberEntries = await Promise.all(captainTeams.map(async (team) => [team.id, await teamService.listMembers(team.id)] as const))
const membersByTeamId = new Map(memberEntries)
const userById = new Map(users.map((user) => [user.id, user]))

const initialTeamId = captainTeams.some((team) => team.id === route.query.team)
  ? String(route.query.team)
  : captainTeams[0]?.id ?? ''
const selectedTeamId = ref(initialTeamId)
const selectedPlayerIds = ref<string[]>([])
const tournamentCaptainId = ref('')
const comment = ref('')
const check = ref<ApplicationCheck | null>(null)
const checking = ref(false)
const submitting = ref(false)
const submitError = ref('')

const selectedTeam = computed(() => captainTeams.find((team) => team.id === selectedTeamId.value) ?? null)
const selectedMembers = computed(() => membersByTeamId.get(selectedTeamId.value) ?? [])

const buildPayload = () => ({
  tournamentId,
  teamId: selectedTeamId.value,
  submittedByUserId: auth.user?.id ?? '',
  playerIds: selectedPlayerIds.value,
  tournamentCaptainId: tournamentCaptainId.value,
  comment: comment.value.trim() || undefined
})

const refreshCheck = async () => {
  if (!tournament || !selectedTeamId.value || !auth.user) {
    check.value = null
    return
  }
  checking.value = true
  check.value = await applicationService.check(buildPayload())
  checking.value = false
}

const selectTeam = async (teamId: string) => {
  selectedTeamId.value = teamId
  const members = membersByTeamId.get(teamId) ?? []
  selectedPlayerIds.value = members.slice(0, tournament?.requiredTeamSize ?? 0).map((member) => member.userId)
  tournamentCaptainId.value = selectedPlayerIds.value.includes(auth.user?.id ?? '')
    ? auth.user!.id
    : selectedPlayerIds.value[0] ?? ''
  submitError.value = ''
  await refreshCheck()
}

const togglePlayer = async (userId: string) => {
  if (selectedPlayerIds.value.includes(userId)) {
    selectedPlayerIds.value = selectedPlayerIds.value.filter((id) => id !== userId)
  } else if (selectedPlayerIds.value.length < (tournament?.requiredTeamSize ?? 0)) {
    selectedPlayerIds.value = [...selectedPlayerIds.value, userId]
  }

  if (!selectedPlayerIds.value.includes(tournamentCaptainId.value)) {
    tournamentCaptainId.value = selectedPlayerIds.value[0] ?? ''
  }
  submitError.value = ''
  await refreshCheck()
}

const submitApplication = async () => {
  if (!check.value?.eligible) return
  submitting.value = true
  submitError.value = ''
  try {
    await applicationService.create(buildPayload())
    await navigateTo(`/tournaments/${tournamentId}?application=sent`)
  } catch {
    submitError.value = 'Не получилось отправить заявку. Проверьте состав ещё раз.'
    await refreshCheck()
  } finally {
    submitting.value = false
  }
}

if (initialTeamId) await selectTeam(initialTeamId)

useHead({ title: tournament ? `Заявка — ${tournament.name}` : 'Заявка на турнир' })
</script>

<template>
  <section class="workspace-page workspace-page--tournament-apply">
    <PageHead
      :title="tournament ? `Заявка на ${tournament.name}` : 'Турнир не найден'"
      subtitle="Выберите команду и игроков, которые будут участвовать в турнире."
    />

    <template v-if="tournament">
      <TournamentNav :tournament-id="tournament.id" active="overview" />

      <div v-if="captainTeams.length" class="tournament-apply-layout">
        <form class="tournament-apply-form" @submit.prevent="submitApplication">
          <fieldset class="tournament-apply-section">
            <legend>Команда</legend>
            <div class="tournament-team-picker">
              <label v-for="team in captainTeams" :key="team.id" :class="{ 'is-selected': selectedTeamId === team.id }">
                <input type="radio" name="applicationTeam" :value="team.id" :checked="selectedTeamId === team.id" @change="selectTeam(team.id)">
                <span>{{ team.name }}</span>
                <small>{{ team.memberIds.length }} игроков · {{ team.city }}</small>
              </label>
            </div>
          </fieldset>

          <fieldset v-if="selectedTeam" class="tournament-apply-section">
            <legend>Состав: {{ selectedPlayerIds.length }}/{{ tournament.requiredTeamSize }}</legend>
            <p>Выберите игроков, которые выступят за команду.</p>
            <div class="tournament-roster-picker">
              <label v-for="member in selectedMembers" :key="member.id" :class="{ 'is-selected': selectedPlayerIds.includes(member.userId) }">
                <input
                  type="checkbox"
                  :checked="selectedPlayerIds.includes(member.userId)"
                  :disabled="!selectedPlayerIds.includes(member.userId) && selectedPlayerIds.length >= tournament.requiredTeamSize"
                  @change="togglePlayer(member.userId)"
                >
                <span>{{ userById.get(member.userId)?.name ?? 'Игрок' }}</span>
                <small>{{ userById.get(member.userId)?.age ? `${userById.get(member.userId)?.age} лет` : 'Возраст не указан' }}</small>
              </label>
            </div>
          </fieldset>

          <div v-if="selectedPlayerIds.length" class="tournament-apply-section">
            <label class="form-label" for="tournamentCaptain">Капитан команды на турнире</label>
            <select id="tournamentCaptain" v-model="tournamentCaptainId" class="form-select" @change="refreshCheck">
              <option v-for="userId in selectedPlayerIds" :key="userId" :value="userId">{{ userById.get(userId)?.name ?? 'Игрок' }}</option>
            </select>
          </div>

          <div class="tournament-apply-section">
            <label class="form-label" for="applicationComment">Комментарий организатору <span class="text-muted-strong">(по желанию)</span></label>
            <textarea id="applicationComment" v-model="comment" class="form-control" rows="3" placeholder="Например, когда команда может играть"></textarea>
          </div>

          <p v-if="submitError" class="form-error">{{ submitError }}</p>
          <button class="cta-button cta-button-primary" type="submit" :disabled="checking || submitting || !check?.eligible">
            {{ submitting ? 'Отправляем…' : 'Подать заявку' }}
          </button>
        </form>

        <aside class="tournament-application-check" aria-live="polite">
          <h2>Проверка заявки</h2>
          <template v-if="check?.eligible">
            <strong class="tournament-check-ok">Состав подходит</strong>
            <p>После отправки организатор проверит заявку.</p>
          </template>
          <template v-else-if="check?.issues.length">
            <ul>
              <li v-for="issue in check.issues" :key="issue">{{ issue }}</li>
            </ul>
            <div v-if="check.conflicts.length" class="tournament-conflicts">
              <p v-for="conflict in check.conflicts" :key="`${conflict.userId}-${conflict.teamId}`">
                {{ conflict.userName }} уже заявлен за {{ conflict.teamName }}.
              </p>
            </div>
          </template>
        </aside>
      </div>

      <div v-else class="empty-state-panel">
        <h2>Нет подходящей команды</h2>
        <p>Заявку может подать капитан команды по виду спорта {{ tournament.sport === 'cs2' ? 'CS2' : tournament.sport }}.</p>
        <NuxtLink class="cta-button cta-button-primary" to="/teams/create">Создать команду</NuxtLink>
      </div>
    </template>

    <div v-else class="empty-state-panel">
      <h2>Турнир не найден</h2>
      <NuxtLink class="cta-button cta-button-primary" to="/tournaments">Смотреть турниры</NuxtLink>
    </div>
  </section>
</template>
