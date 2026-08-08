<script setup lang="ts">
import { applicationService, teamService, tournamentService } from '~/services'
import type { ApplicationStatus, SportKey, TournamentStatus } from '~/types/domain'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
if (!auth.initialized) await auth.loadCurrentUser()

const tournament = await tournamentService.getById(String(route.params.id))
const applications = tournament ? await applicationService.list({ tournamentId: tournament.id }) : []
const rosters = tournament ? await applicationService.listRosters({ tournamentId: tournament.id }) : []
const approvedApplications = applications.filter((application) => application.status === 'approved')
const pendingApplications = applications.filter((application) => application.status === 'pending')
const userTeams = auth.user ? await teamService.listByUser(auth.user.id) : []
const captainTeamIds = new Set(userTeams.filter((team) => team.captainId === auth.user?.id).map((team) => team.id))
const allTeams = await teamService.list()
const eligibleCaptainTeams = (auth.isAdmin ? allTeams : userTeams.filter((team) => team.captainId === auth.user?.id))
  .filter((team) => team.sport === tournament?.sport)
const ownApplications = applications.filter((application) => (
  captainTeamIds.has(application.teamId)
  || rosters.some((roster) => roster.teamId === application.teamId && auth.user && roster.playerIds.includes(auth.user.id))
))
const ownApplication = ownApplications[0] ?? null
const applicationSent = ref(route.query.application === 'sent')

onMounted(() => {
  if (!applicationSent.value) return
  const query = { ...route.query }
  delete query.application
  void router.replace({ path: route.path, query })
})
const canReapply = Boolean(
  ownApplication?.status === 'rejected'
  && ownApplication.reapplyAllowed
  && tournament?.status === 'registration_open'
)

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const statusLabels: Record<TournamentStatus, string> = {
  draft: 'Готовится',
  registration_open: 'Идут заявки',
  registration_closed: 'Заявки закрыты',
  active: 'Идёт турнир',
  finished: 'Завершён'
}

const applicationStatusLabels: Record<ApplicationStatus, string> = {
  pending: 'Заявка на проверке',
  approved: 'Команда допущена',
  rejected: 'Заявка отклонена',
  excluded: 'Команда исключена'
}

const formatDate = (value?: string) => value
  ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value))
  : 'Не указано'

const applicationCountLabel = (count: number) => {
  const remainder100 = count % 100
  const remainder10 = count % 10
  if (remainder100 >= 11 && remainder100 <= 14) return `${count} заявок на проверке`
  if (remainder10 === 1) return `${count} заявка на проверке`
  if (remainder10 >= 2 && remainder10 <= 4) return `${count} заявки на проверке`
  return `${count} заявок на проверке`
}

const ageLabel = computed(() => {
  if (!tournament) return ''
  if (tournament.minAge === undefined && tournament.maxAge === undefined) return 'Без ограничений'
  if (tournament.minAge !== undefined && tournament.maxAge !== undefined) return `${tournament.minAge}–${tournament.maxAge} лет`
  return tournament.minAge !== undefined ? `От ${tournament.minAge} лет` : `До ${tournament.maxAge} лет`
})

useHead({
  title: tournament?.name ?? 'Турнир',
  meta: tournament ? [{ name: 'description', content: `${tournament.name}: даты, формат, команды и правила участия.` }] : []
})
</script>

<template>
  <section class="section-padding workspace-page workspace-page--tournament-detail">
    <div class="container">
      <PageHead
        :title="tournament?.name ?? 'Турнир не найден'"
        :subtitle="tournament ? `${sportLabels[tournament.sport]} · ${tournament.city}` : 'Проверьте адрес страницы или вернитесь к списку турниров.'"
      />

      <template v-if="tournament">
        <TournamentNav :tournament-id="tournament.id" active="overview" />

        <p v-if="applicationSent" class="form-success tournament-application-success">
          Заявка отправлена. Её статус появился в разделе «Мои турниры».
        </p>

        <section class="tournament-overview-hero">
          <div class="tournament-overview-hero__main">
            <div class="tournament-overview-hero__status">
              <StatusBadge :status="tournament.status" :label="statusLabels[tournament.status]" />
              <span>{{ sportLabels[tournament.sport] }}</span>
            </div>
            <h2>{{ tournament.description }}</h2>
            <div class="tournament-overview-hero__dates">
              <div><span>Начало</span><strong>{{ formatDate(tournament.eventStartDate) }}</strong></div>
              <div><span>Место</span><strong>{{ tournament.location }}</strong></div>
            </div>
          </div>

          <aside class="tournament-overview-action">
            <template v-if="canReapply && ownApplication">
              <span>Предыдущая заявка отклонена</span>
              <strong>Можно подать снова</strong>
              <p v-if="ownApplication.rejectReason">{{ ownApplication.rejectReason }}</p>
              <NuxtLink class="cta-button cta-button-primary" :to="`/tournaments/${tournament.id}/apply?team=${ownApplication.teamId}`">Подать заявку</NuxtLink>
            </template>
            <template v-else-if="ownApplication">
              <span>Ваша команда</span>
              <strong>{{ applicationStatusLabels[ownApplication.status] }}</strong>
              <p v-if="ownApplication.rejectReason">{{ ownApplication.rejectReason }}</p>
              <NuxtLink class="cta-button cta-button-secondary" :to="`/tournaments/${tournament.id}/applications/${ownApplication.id}`">Открыть заявку</NuxtLink>
            </template>
            <template v-else-if="tournament.status === 'registration_open' && auth.isAuthenticated && eligibleCaptainTeams.length">
              <span>Регистрация до {{ formatDate(tournament.registrationEndDate) }}</span>
              <strong>{{ Math.max(tournament.maxTeams - approvedApplications.length, 0) }} мест</strong>
              <NuxtLink class="cta-button cta-button-primary" :to="`/tournaments/${tournament.id}/apply`">Подать заявку</NuxtLink>
            </template>
            <template v-else-if="tournament.status === 'registration_open' && auth.isAuthenticated">
              <span>Для заявки нужна команда</span>
              <strong>Вы должны быть её капитаном</strong>
              <p>Команда должна играть в {{ sportLabels[tournament.sport] }}.</p>
              <NuxtLink class="cta-button cta-button-primary" to="/teams/create">Создать команду</NuxtLink>
            </template>
            <template v-else-if="tournament.status === 'registration_open'">
              <span>Чтобы подать заявку</span>
              <strong>Войдите в аккаунт</strong>
              <NuxtLink class="cta-button cta-button-primary" :to="{ path: '/login', query: { redirect: route.fullPath } }">Войти</NuxtLink>
            </template>
            <template v-else>
              <span>Статус</span>
              <strong>{{ statusLabels[tournament.status] }}</strong>
              <NuxtLink class="cta-button cta-button-secondary" :to="`/tournaments/${tournament.id}/teams`">Смотреть команды</NuxtLink>
            </template>
          </aside>
        </section>

        <div class="tournament-overview-grid">
          <section class="tournament-overview-section">
            <div class="tournament-overview-section__head">
              <h2>Даты</h2>
              <span>{{ applicationCountLabel(pendingApplications.length) }}</span>
            </div>
            <dl>
              <div><dt>Начало регистрации</dt><dd>{{ formatDate(tournament.registrationStartDate) }}</dd></div>
              <div><dt>Конец регистрации</dt><dd>{{ formatDate(tournament.registrationEndDate) }}</dd></div>
              <div><dt>Начало турнира</dt><dd>{{ formatDate(tournament.eventStartDate) }}</dd></div>
              <div><dt>Окончание</dt><dd>{{ formatDate(tournament.eventEndDate) }}</dd></div>
            </dl>
          </section>

          <section class="tournament-overview-section tournament-overview-section--requirements">
            <div class="tournament-overview-section__head">
              <h2>Участие</h2>
              <NuxtLink :to="`/tournaments/${tournament.id}/rules`">Все правила</NuxtLink>
            </div>
            <dl>
              <div><dt>Состав</dt><dd>{{ tournament.requiredTeamSize }} игроков</dd></div>
              <div><dt>Возраст</dt><dd>{{ ageLabel }}</dd></div>
              <div><dt>Формат</dt><dd>{{ tournament.matchFormat }}</dd></div>
              <div><dt>Команды</dt><dd>{{ approvedApplications.length }}/{{ tournament.maxTeams }}</dd></div>
            </dl>
          </section>
        </div>
      </template>

      <div v-else class="empty-state-panel">
        <h2>Турнир не найден</h2>
        <p>Возможно, ссылка устарела или турнир удалён.</p>
        <NuxtLink class="cta-button cta-button-primary" to="/tournaments">Смотреть турниры</NuxtLink>
      </div>
    </div>
  </section>
</template>
