<script setup lang="ts">
import { applicationService, teamService, tournamentService, userService } from '~/services'

const route = useRoute()
const tournamentId = String(route.params.id)
const tournament = await tournamentService.getById(tournamentId)
const [applications, teams, users, rosters] = await Promise.all([
  applicationService.list({ tournamentId }),
  teamService.list(),
  userService.list(),
  applicationService.listRosters({ tournamentId })
])

const teamById = new Map(teams.map((team) => [team.id, team]))
const userById = new Map(users.map((user) => [user.id, user]))
const rosterByTeamId = new Map(rosters.map((roster) => [roster.teamId, roster]))
const visibleApplications = applications.filter((application) => application.status === 'pending' || application.status === 'approved')
const approvedApplications = visibleApplications.filter((application) => application.status === 'approved')
const pendingApplications = visibleApplications.filter((application) => application.status === 'pending')

useHead({ title: tournament ? `Команды — ${tournament.name}` : 'Команды турнира' })
</script>

<template>
  <section class="section-padding workspace-page workspace-page--tournament-detail">
    <div class="container">
      <PageHead :title="tournament?.name ?? 'Турнир не найден'" subtitle="Команды, которые уже допущены или ждут решения организатора." />

      <template v-if="tournament">
        <TournamentNav :tournament-id="tournament.id" active="teams" />

        <div class="tournament-participants-summary">
          <div><strong>{{ approvedApplications.length }}</strong><span>Допущено</span></div>
          <div><strong>{{ pendingApplications.length }}</strong><span>На проверке</span></div>
          <div><strong>{{ Math.max(tournament.maxTeams - approvedApplications.length, 0) }}</strong><span>Свободных мест</span></div>
        </div>

        <div v-if="visibleApplications.length" class="tournament-team-list">
          <article v-for="application in visibleApplications" :key="application.id" class="tournament-team-row">
            <div class="tournament-team-row__main">
              <span>{{ application.status === 'approved' ? 'Допущена' : 'На проверке' }}</span>
              <h2>{{ teamById.get(application.teamId)?.name ?? 'Команда не найдена' }}</h2>
              <p>{{ teamById.get(application.teamId)?.city }} · {{ rosterByTeamId.get(application.teamId)?.playerIds.length ?? 0 }} игроков</p>
            </div>
            <div class="tournament-team-row__captain">
              <span>Капитан на турнире</span>
              <strong>{{ userById.get(rosterByTeamId.get(application.teamId)?.captainId ?? '')?.name ?? 'Не назначен' }}</strong>
            </div>
            <NuxtLink :to="`/teams/${application.teamId}`">Открыть команду</NuxtLink>
          </article>
        </div>

        <div v-else class="empty-state-panel">
          <h2>Команд пока нет</h2>
          <p>Первая поданная заявка появится здесь.</p>
        </div>
      </template>

      <div v-else class="empty-state-panel">
        <h2>Турнир не найден</h2>
        <NuxtLink class="cta-button cta-button-primary" to="/tournaments">Смотреть турниры</NuxtLink>
      </div>
    </div>
  </section>
</template>
