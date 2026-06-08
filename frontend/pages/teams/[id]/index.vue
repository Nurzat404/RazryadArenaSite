<script setup lang="ts">
import { applicationService, matchService, teamService, tournamentService, userService } from '~/services'
import type { ApplicationStatus, MatchStatus, SportKey } from '~/types/domain'

const route = useRoute()
const teamId = String(route.params.id)
const [team, users, members, invites, requests, applications, matches, tournaments] = await Promise.all([
  teamService.getById(teamId),
  userService.list(),
  teamService.listMembers(teamId),
  teamService.listInvites(teamId),
  teamService.listRequests(teamId),
  applicationService.list({ teamId }),
  matchService.list({ teamId }),
  tournamentService.list()
])

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const applicationStatusLabels: Record<ApplicationStatus, string> = {
  pending: 'На проверке',
  approved: 'Допущена',
  rejected: 'Отклонена',
  excluded: 'Исключена'
}

const matchStatusLabels: Record<MatchStatus, string> = {
  scheduled: 'Назначен',
  active: 'Идёт',
  finished: 'Завершён',
  technical_win: 'Технический результат'
}

const userById = new Map(users.map((user) => [user.id, user]))
const tournamentById = new Map(tournaments.map((tournament) => [tournament.id, tournament]))
const activeInvite = invites.find((invite) => invite.status === 'active')
const pendingRequests = requests.filter((request) => request.status === 'pending')
const captain = team ? userById.get(team.captainId) : null

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))

useHead({
  title: team ? `${team.name} — команда РазрядАрены` : 'Команда не найдена'
})
</script>

<template>
  <section class="section-padding">
    <div class="container">
      <PageHead
        :title="team?.name ?? 'Команда не найдена'"
        subtitle="Состав, капитан, заявки, турниры и ближайшие матчи команды."
      />

      <div v-if="team" class="team-detail-layout">
        <article class="profile-card profile-card--wide">
          <div class="profile-card__head">
            <div>
              <span class="profile-card__badge">{{ sportLabels[team.sport] }}</span>
              <h2>{{ team.name }}</h2>
            </div>
            <strong>{{ team.rating }}</strong>
          </div>

          <dl class="profile-card__meta">
            <div>
              <dt>Капитан</dt>
              <dd>{{ captain?.name ?? 'Не найден' }}</dd>
            </div>
            <div>
              <dt>Город</dt>
              <dd>{{ team.city }}</dd>
            </div>
            <div>
              <dt>Состав</dt>
              <dd>{{ team.memberIds.length }}/{{ team.maxMembers }}</dd>
            </div>
          </dl>

          <p class="profile-card__note">
            Заявки в команду {{ team.isOpenForRequests ? 'открыты' : 'закрыты' }}.
            Invite-ссылка {{ team.inviteEnabled ? 'включена' : 'выключена' }}.
            Режим вступления: {{ team.inviteJoinMode === 'direct' ? 'сразу по ссылке' : 'через заявку капитану' }}.
          </p>

          <div class="profile-card__actions">
            <NuxtLink class="cta-button cta-button-primary" :to="`/teams/${team.id}/members`">Состав</NuxtLink>
            <NuxtLink class="cta-button cta-button-secondary" :to="`/teams/${team.id}/requests`">Заявки</NuxtLink>
            <NuxtLink class="cta-button cta-button-secondary" :to="`/teams/${team.id}/invite`">Invite</NuxtLink>
            <NuxtLink class="cta-button cta-button-secondary" :to="`/teams/${team.id}/edit`">Настройки</NuxtLink>
          </div>
        </article>

        <aside class="team-side-panel">
          <div>
            <span>Новых заявок</span>
            <strong>{{ pendingRequests.length }}</strong>
          </div>
          <div>
            <span>Активная ссылка</span>
            <strong>{{ activeInvite?.code ?? 'Нет' }}</strong>
          </div>
          <div>
            <span>Матчей в расписании</span>
            <strong>{{ matches.length }}</strong>
          </div>
        </aside>
      </div>

      <div v-if="team" class="profile-grid mt-3">
        <article class="profile-card">
          <div class="profile-card__head">
            <div>
              <span class="profile-card__badge">Состав</span>
              <h2>{{ members.length }} игроков</h2>
            </div>
          </div>
          <div class="team-member-list">
            <div v-for="member in members" :key="member.id" class="team-member-row">
              <div>
                <strong>{{ userById.get(member.userId)?.name ?? 'Игрок не найден' }}</strong>
                <span>{{ member.role === 'captain' ? 'Капитан' : 'Игрок' }}</span>
              </div>
              <small>{{ formatDate(member.joinedAt) }}</small>
            </div>
          </div>
        </article>

        <article class="profile-card">
          <div class="profile-card__head">
            <div>
              <span class="profile-card__badge">Турниры</span>
              <h2>{{ applications.length ? 'Заявки команды' : 'Пока нет заявок' }}</h2>
            </div>
          </div>
          <div v-if="applications.length" class="team-list-stack">
            <div v-for="application in applications" :key="application.id" class="team-list-row">
              <div>
                <strong>{{ tournamentById.get(application.tournamentId)?.name ?? 'Турнир не найден' }}</strong>
                <span>{{ application.comment || application.rejectReason || 'Комментариев нет' }}</span>
              </div>
              <StatusBadge :status="application.status" :label="applicationStatusLabels[application.status]" />
            </div>
          </div>
          <p v-else class="profile-card__note">
            Команда еще не подавала заявки. Откройте турниры и выберите подходящий.
          </p>
        </article>

        <article class="profile-card">
          <div class="profile-card__head">
            <div>
              <span class="profile-card__badge">Матчи</span>
              <h2>{{ matches.length ? 'Расписание и результаты' : 'Матчей пока нет' }}</h2>
            </div>
          </div>
          <div v-if="matches.length" class="team-list-stack">
            <div v-for="match in matches" :key="match.id" class="team-list-row">
              <div>
                <strong>{{ tournamentById.get(match.tournamentId)?.name ?? 'Турнир не найден' }}</strong>
                <span>{{ formatDate(match.scheduledAt) }} · {{ match.location }}</span>
              </div>
              <StatusBadge :status="match.status" :label="matchStatusLabels[match.status]" />
            </div>
          </div>
          <p v-else class="profile-card__note">
            Матчи появятся после допуска команды и генерации расписания.
          </p>
        </article>

        <article class="profile-card">
          <div class="profile-card__head">
            <div>
              <span class="profile-card__badge">Действия</span>
              <h2>Что можно сделать дальше</h2>
            </div>
          </div>
          <p class="profile-card__note">
            Подайте заявку на турнир, откройте invite-ссылку или проверьте входящие заявки в команду.
          </p>
          <div class="profile-card__actions">
            <NuxtLink class="cta-button cta-button-primary" to="/tournaments">Смотреть турниры</NuxtLink>
            <NuxtLink class="cta-button cta-button-secondary" to="/teams">Все команды</NuxtLink>
          </div>
        </article>
      </div>

      <div v-else class="empty-state-panel">
        <h2>Команда не найдена</h2>
        <p>Возможно, команда была удалена или ссылка устарела.</p>
        <div class="empty-state-panel__actions">
          <NuxtLink class="cta-button cta-button-primary" to="/teams">Вернуться к командам</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
