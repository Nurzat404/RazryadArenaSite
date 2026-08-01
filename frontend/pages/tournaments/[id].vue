<script setup lang="ts">
import { applicationService, tournamentService } from '~/services'
import type { SportKey, TournamentStatus } from '~/types/domain'

const route = useRoute()
const tournament = await tournamentService.getById(String(route.params.id))
const applications = tournament
  ? await applicationService.list({ tournamentId: tournament.id })
  : []

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

const registrationText: Record<TournamentStatus, string> = {
  draft: 'Регистрация ещё не открылась. Даты уже можно посмотреть и обсудить состав с командой.',
  registration_open: 'Сейчас можно готовить состав и подавать заявку от команды.',
  registration_closed: 'Приём заявок завершён. Проверьте расписание и статус своей команды.',
  active: 'Турнир уже идёт. Ближайшие игры смотрите в расписании матчей.',
  finished: 'Турнир завершён. Результаты матчей остаются в общем списке.'
}

const formatDate = (value?: string) => value
  ? new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(value))
  : 'Не указана'

useHead({
  title: tournament?.name ?? 'Турнир',
  meta: tournament
    ? [{ name: 'description', content: `${tournament.name}: сроки регистрации, состав команды и даты проведения.` }]
    : []
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
        <div class="profile-grid">
          <article class="profile-card profile-card--wide">
            <div class="profile-card__head">
              <div>
                <span class="profile-card__badge">{{ sportLabels[tournament.sport] }}</span>
                <h2>О турнире</h2>
              </div>
              <StatusBadge :status="tournament.status" :label="statusLabels[tournament.status]" />
            </div>

            <p class="profile-card__note">{{ tournament.description }}</p>

            <dl class="profile-card__meta">
              <div>
                <dt>Регистрация с</dt>
                <dd>{{ formatDate(tournament.registrationStartDate) }}</dd>
              </div>
              <div>
                <dt>Регистрация до</dt>
                <dd>{{ formatDate(tournament.registrationEndDate) }}</dd>
              </div>
              <div>
                <dt>Начало турнира</dt>
                <dd>{{ formatDate(tournament.eventStartDate) }}</dd>
              </div>
              <div>
                <dt>Окончание</dt>
                <dd>{{ formatDate(tournament.eventEndDate) }}</dd>
              </div>
            </dl>
          </article>

          <article class="profile-card">
            <div class="profile-card__head">
              <div>
                <span class="profile-card__badge">Участие</span>
                <h2>{{ applications.length }}/{{ tournament.maxTeams }} заявок</h2>
              </div>
            </div>

            <dl class="profile-card__meta">
              <div>
                <dt>Игроков в составе</dt>
                <dd>{{ tournament.requiredTeamSize }}</dd>
              </div>
              <div>
                <dt>Лимит команд</dt>
                <dd>{{ tournament.maxTeams }}</dd>
              </div>
              <div>
                <dt>Место</dt>
                <dd>{{ tournament.city }}</dd>
              </div>
            </dl>

            <p class="profile-card__note">{{ registrationText[tournament.status] }}</p>

            <div class="profile-card__actions">
              <NuxtLink class="cta-button cta-button-secondary" to="/tournaments">Все турниры</NuxtLink>
            </div>
          </article>
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
