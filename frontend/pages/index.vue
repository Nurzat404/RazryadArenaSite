<script setup lang="ts">
import { applicationService, matchService, newsService, ratingService, teamService, tournamentService } from '~/services'
import type { SiteNewsType, SportKey, TournamentStatus } from '~/types/domain'

const auth = useAuthStore()

if (!auth.initialized) {
  await auth.loadCurrentUser()
}

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

const tournamentStatusLabels: Record<TournamentStatus, string> = {
  draft: 'Готовится',
  registration_open: 'Идут заявки',
  registration_closed: 'Заявки закрыты',
  active: 'Идёт турнир',
  finished: 'Завершён'
}

const newsTypeLabels: Record<SiteNewsType, string> = {
  announcement: 'Важно',
  tournament: 'Турнир',
  update: 'Обновление'
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long'
  }).format(new Date(value))

const [tournaments, allTeams, ratingRows, newsItems, rosters, allMatches] = await Promise.all([
  tournamentService.list(),
  teamService.list(),
  ratingService.leaderboard(),
  newsService.list(3),
  applicationService.listRosters(),
  matchService.list()
])

const userTeams = auth.user ? await teamService.listByUser(auth.user.id) : []
const userRosterKeys = new Set(rosters
  .filter((roster) => auth.user && roster.playerIds.includes(auth.user.id))
  .map((roster) => `${roster.tournamentId}:${roster.teamId}`))
const upcomingMatches = allMatches
  .filter((match) => ['scheduled', 'active'].includes(match.status))
  .filter((match) => userRosterKeys.has(`${match.tournamentId}:${match.team1Id}`) || userRosterKeys.has(`${match.tournamentId}:${match.team2Id}`))
  .slice(0, 3)
const teamById = new Map(allTeams.map((team) => [team.id, team]))
const tournamentById = new Map(tournaments.map((tournament) => [tournament.id, tournament]))
const upcomingTournaments = tournaments
  .filter((tournament) => !['draft', 'finished'].includes(tournament.status))
  .sort((a, b) => a.eventStartDate.localeCompare(b.eventStartDate))
  .slice(0, 3)

const topRatingRows = ratingRows.slice(0, 5)
const popularTeams = [...allTeams].sort((a, b) => b.rating - a.rating).slice(0, 4)

const dashboardStats = [
  {
    label: 'Моих команд',
    value: userTeams.length
  },
  {
    label: 'Ближайших матчей',
    value: upcomingMatches.length
  },
  {
    label: 'Турниров открыто',
    value: tournaments.filter((tournament) => tournament.status === 'registration_open').length
  }
]

const formatDateTime = (value: string) => new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
}).format(new Date(value))

const faqItems = [
  {
    question: 'Зачем нужен аккаунт?',
    answer:
      'Чтобы после входа видеть свои команды, заявки и ближайшие матчи.'
  },
  {
    question: 'Можно ли создать команду после регистрации?',
    answer:
      'Да. После регистрации откройте раздел команд и соберите свою. Турниры создаёт администратор.'
  },
  {
    question: 'Как команда подаёт заявку на турнир?',
    answer:
      'Капитан выбирает турнир, проверяет состав и отправляет заявку. Её статус будет виден в личном кабинете.'
  },
  {
    question: 'Где смотреть расписание и результаты?',
    answer:
      'В матчах видно соперников, время, место и результат. Не нужно листать переписку за прошлую неделю.'
  },
  {
    question: 'Как считается рейтинг?',
    answer:
      'По подтверждённым результатам. После принятого результата очки пересчитываются.'
  },
  {
    question: 'Подойдёт для школьной или городской лиги?',
    answer:
      'Да. Подойдёт школьным, студенческим, дворовым и городским лигам.'
  }
]

const openFaqIndex = ref(0)

const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? -1 : index
}

useHead(() => ({
  title: auth.isAuthenticated
    ? 'Главная'
    : 'Турниры, команды и матчи без путаницы',
  bodyAttrs: {
    class: auth.isAuthenticated ? 'layout-user home-dashboard-page' : 'layout-public home-landing',
    'data-page': 'home',
    'data-role': auth.isAuthenticated ? 'user' : 'public'
  }
}))
</script>

<template>
  <div>
    <template v-if="auth.isAuthenticated">
      <ClientOnly>
        <section class="home-dashboard section-padding" aria-labelledby="dashboard-title">
        <div class="container">
          <div class="home-dashboard__hero">
            <div>
              <p class="home-kicker">Главная</p>
              <h1 id="dashboard-title" class="home-dashboard__title">
                Матчи, заявки и команды
              </h1>
              <p class="home-dashboard__lead">
                Сводка для {{ auth.user?.name }}: что скоро начнётся и где нужен ответ.
              </p>
            </div>
            <div class="home-dashboard__actions" aria-label="Быстрые действия">
              <NuxtLink class="cta-button cta-button-primary" to="/tournaments">Смотреть турниры</NuxtLink>
              <NuxtLink class="cta-button cta-button-secondary" to="/teams/create">Создать команду</NuxtLink>
            </div>
          </div>

          <div class="home-dashboard__stats" aria-label="Короткая сводка">
            <article v-for="item in dashboardStats" :key="item.label" class="home-dashboard-stat">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </article>
          </div>

          <div class="home-dashboard-grid">
            <section v-if="upcomingMatches.length" class="home-dashboard-card home-dashboard-card--wide" aria-labelledby="home-matches-title">
              <div class="home-dashboard-card__head">
                <div>
                  <p class="home-kicker">Мои матчи</p>
                  <h2 id="home-matches-title">Ближайшие игры</h2>
                </div>
                <NuxtLink to="/profile/matches">Все мои матчи</NuxtLink>
              </div>
              <div class="home-dashboard-list">
                <NuxtLink v-for="match in upcomingMatches" :key="match.id" class="home-dashboard-item home-dashboard-item--tournament" :to="`/matches/${match.id}`">
                  <div>
                    <span class="home-dashboard-badge">{{ sportLabels[match.sport] }}</span>
                    <h3>{{ teamById.get(match.team1Id)?.name }} — {{ teamById.get(match.team2Id)?.name }}</h3>
                    <p>{{ tournamentById.get(match.tournamentId)?.name }} · {{ formatDateTime(match.scheduledAt) }}</p>
                  </div>
                  <div class="home-dashboard-item__meta"><strong>{{ match.status === 'active' ? 'Идёт сейчас' : 'Назначен' }}</strong><span>{{ match.location }}</span></div>
                </NuxtLink>
              </div>
            </section>

            <section class="home-dashboard-card home-dashboard-card--wide home-dashboard-card--tournaments" aria-labelledby="home-tournaments-title">
              <div class="home-dashboard-card__head">
                <div>
                  <p class="home-kicker">Ближайшие турниры</p>
                  <h2 id="home-tournaments-title">Скоро начнутся</h2>
                </div>
                <NuxtLink to="/tournaments">Все турниры</NuxtLink>
              </div>

              <div class="home-dashboard-list">
                <NuxtLink v-for="tournament in upcomingTournaments" :key="tournament.id" class="home-dashboard-item home-dashboard-item--tournament" :to="`/tournaments/${tournament.id}`">
                  <div>
                    <span class="home-dashboard-badge">{{ sportLabels[tournament.sport] }}</span>
                    <h3>{{ tournament.name }}</h3>
                    <p>{{ tournament.city }} · старт {{ formatDate(tournament.eventStartDate) }}</p>
                  </div>
                  <div class="home-dashboard-item__meta">
                    <strong>{{ tournamentStatusLabels[tournament.status] }}</strong>
                    <span>{{ tournament.requiredTeamSize }} игроков в составе</span>
                  </div>
                </NuxtLink>
              </div>
            </section>

            <section class="home-dashboard-card home-dashboard-card--my-teams" aria-labelledby="home-teams-title">
              <div class="home-dashboard-card__head">
                <div>
                  <p class="home-kicker">Мои команды</p>
                  <h2 id="home-teams-title">Ваши составы</h2>
                </div>
                <NuxtLink to="/profile/teams">Профиль</NuxtLink>
              </div>

              <div v-if="userTeams.length" class="home-dashboard-list">
                <NuxtLink v-for="team in userTeams" :key="team.id" class="home-dashboard-item home-dashboard-item--compact" :to="`/teams/${team.id}`">
                  <div>
                    <span class="home-dashboard-badge">{{ sportLabels[team.sport] }}</span>
                    <h3>{{ team.name }}</h3>
                    <p>{{ team.city }} · {{ team.memberIds.length }}/{{ team.maxMembers }} игроков</p>
                  </div>
                  <div class="home-dashboard-item__meta">
                    <strong>{{ team.rating }}</strong>
                    <span>рейтинг</span>
                  </div>
                </NuxtLink>
              </div>

              <div v-else class="home-dashboard-empty">
                <h3>Команды ещё нет</h3>
                <p>Можно собрать свою команду или найти открытую под нужный вид спорта.</p>
                <NuxtLink to="/teams">Открыть команды</NuxtLink>
              </div>
            </section>

            <section class="home-dashboard-card home-dashboard-card--ranking" aria-labelledby="home-ratings-title">
              <div class="home-dashboard-card__head">
                <div>
                  <p class="home-kicker">Рейтинг</p>
                  <h2 id="home-ratings-title">Топ сейчас</h2>
                </div>
                <NuxtLink to="/ratings">Весь рейтинг</NuxtLink>
              </div>

              <ol class="home-dashboard-ranking">
                <li v-for="row in topRatingRows" :key="row.id">
                  <span>{{ row.position }}</span>
                  <strong>{{ row.entityName }}</strong>
                  <small>{{ sportLabels[row.sport] }} · {{ row.points }} очков</small>
                </li>
              </ol>
            </section>

            <section class="home-dashboard-card home-dashboard-card--popular" aria-labelledby="home-popular-teams-title">
              <div class="home-dashboard-card__head">
                <div>
                  <p class="home-kicker">Команды</p>
                  <h2 id="home-popular-teams-title">Популярные команды</h2>
                </div>
                <NuxtLink to="/teams">Все команды</NuxtLink>
              </div>

              <div class="home-dashboard-list">
                <NuxtLink v-for="team in popularTeams" :key="team.id" class="home-dashboard-item home-dashboard-item--compact" :to="`/teams/${team.id}`">
                  <div>
                    <span class="home-dashboard-badge">{{ sportLabels[team.sport] }}</span>
                    <h3>{{ team.name }}</h3>
                    <p>{{ team.isOpenForRequests ? 'Принимают заявки' : 'Состав закрыт' }}</p>
                  </div>
                  <div class="home-dashboard-item__meta">
                    <strong>{{ team.rating }}</strong>
                    <span>очков</span>
                  </div>
                </NuxtLink>
              </div>
            </section>

            <section class="home-dashboard-card home-dashboard-card--wide home-dashboard-card--news" aria-labelledby="home-news-title">
              <div class="home-dashboard-card__head">
                <div>
                  <p class="home-kicker">Новости</p>
                  <h2 id="home-news-title">Последние новости</h2>
                </div>
              </div>

              <div class="home-dashboard-news">
                <article v-for="item in newsItems" :key="item.id">
                  <span>{{ newsTypeLabels[item.type] }} · {{ formatDate(item.publishedAt) }}</span>
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.body }}</p>
                  <NuxtLink v-if="item.actionUrl" :to="item.actionUrl">Открыть</NuxtLink>
                </article>
              </div>
            </section>
          </div>
        </div>
        </section>
      </ClientOnly>
    </template>

    <template v-else>
<!-- Главный экран с более компактной продуктовой подачей -->
      <section class="home-hero" aria-labelledby="hero-title">
        <div class="container">
          <div class="home-hero__shell">
            <div class="home-hero__content" data-animate="animate__fadeInUp">
              <p class="home-kicker">Для игроков и команд</p>
              <h1 id="hero-title" class="home-hero__title">Турниры без хаоса в чатах.</h1>
              <p class="home-hero__lead">
                Когда заявки живут в личке, расписание в таблице, а результаты в чате, всё быстро путается.
                РазрядАрена помогает держать сезон в порядке: кто играет, когда матч и что уже сыграно.
              </p>
              <div class="home-hero__actions" aria-label="Основные действия">
                <a class="cta-button cta-button-primary" href="/register">Создать аккаунт</a>
                <a class="cta-button cta-button-secondary" href="/tournaments">Смотреть турниры</a>
              </div>
            </div>
            <figure class="home-hero__media" data-animate="animate__fadeInRight" data-animate-delay="120">
              <img
                class="home-hero__image"
                src="/assets/img/hero-team-huddle.jpg"
                sizes="(max-width: 991px) 100vw, 46vw"
                alt="Команда собралась в круг на футбольном поле перед матчем"
                fetchpriority="high"
                decoding="async"
              />
              <figcaption class="home-hero__media-caption">
                <span class="home-hero__media-tag">Команда</span>
                <strong>Игроки видят матч, состав и статус заявки без лишних вопросов</strong>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <!-- Короткий блок выгод с акцентом на рабочую пользу -->
      <section class="home-section home-benefits section-padding" aria-labelledby="benefits-title">
        <div class="container">
          <div class="home-section__heading" data-animate="animate__fadeInUp">
            <p class="home-kicker">Перед началом матча</p>
            <h2 id="benefits-title" class="section-title">Меньше вопросов перед игрой</h2>
            <p class="section-subtitle">Кто играет, когда дедлайн, какой состав заявлен и где результат — эти вещи должны быть видны сразу.</p>
          </div>
          <div class="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4">
            <div class="col">
              <article class="benefit-card" data-animate="animate__fadeInUp">
                <span class="benefit-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M5 6.5h14M5 12h14M5 17.5h9" /></svg>
                </span>
                <h3>Расписание перед глазами</h3>
                <p>Дата матча и переносы не тонут между мемами, голосовыми и “щас уточню”.</p>
              </article>
            </div>
            <div class="col">
              <article class="benefit-card" data-animate="animate__fadeInUp" data-animate-delay="90">
                <span class="benefit-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M7 4h10l3 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8l3-4Z" /><path d="M9 11h6M9 15h4" /></svg>
                </span>
                <h3>Заявка без догадок</h3>
                <p>Капитан видит состав и понимает, можно уже отправлять заявку или кто-то ещё молчит.</p>
              </article>
            </div>
            <div class="col">
              <article class="benefit-card" data-animate="animate__fadeInUp" data-animate-delay="180">
                <span class="benefit-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 4l7 3.5v5c0 4.2-2.8 7.9-7 9.5-4.2-1.6-7-5.3-7-9.5v-5L12 4Z" /><path d="M9.5 12.5 11 14l3.5-3.5" /></svg>
                </span>
                <h3>Правила не надо искать</h3>
                <p>Формат, ограничения и правила матча открываются рядом с турниром, а не в старом файле.</p>
              </article>
            </div>
            <div class="col">
              <article class="benefit-card" data-animate="animate__fadeInUp" data-animate-delay="270">
                <span class="benefit-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M6 18h12M8 18V9m4 9V5m4 13v-7" /></svg>
                </span>
                <h3>Результат без задержки</h3>
                <p>Результаты видны после игры, а не через три дня в переписке.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <!-- Пошаговая логика входа в продукт -->
      <section class="home-section home-process section-padding" aria-labelledby="process-title">
        <div class="container">
          <div class="home-section__heading" data-animate="animate__fadeInUp">
            <p class="home-kicker">Как начать</p>
            <h2 id="process-title" class="section-title">От аккаунта до первого матча</h2>
          </div>
          <div class="process-grid">
            <article class="process-step" data-animate="animate__fadeInUp">
              <span class="process-step__number">1</span>
              <div class="process-step__body">
                <div class="process-step__title-row">
                  <span class="process-step__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>
                  </span>
                  <h3>Зарегистрируйтесь</h3>
                </div>
                <p>Укажите имя, город и виды спорта. Команду можно создать позже.</p>
              </div>
            </article>
            <article class="process-step" data-animate="animate__fadeInUp" data-animate-delay="110">
              <span class="process-step__number">2</span>
              <div class="process-step__body">
                <div class="process-step__title-row">
                  <span class="process-step__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M4 18h16" /><path d="M7 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path d="M17 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg>
                  </span>
                  <h3>Соберите команду</h3>
                </div>
                <p>Создайте команду, добавьте игроков и проверьте, хватает ли состава для турнира.</p>
              </div>
            </article>
            <article class="process-step" data-animate="animate__fadeInUp" data-animate-delay="220">
              <span class="process-step__number">3</span>
              <div class="process-step__body">
                <div class="process-step__title-row">
                  <span class="process-step__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M7 5h10v14H7z" /><path d="M10 9h4M10 13h4" /></svg>
                  </span>
                  <h3>Откройте регламент</h3>
                </div>
                <p>До заявки видно, сколько игроков нужно, какой формат и какие ограничения.</p>
              </div>
            </article>
            <article class="process-step" data-animate="animate__fadeInUp" data-animate-delay="330">
              <span class="process-step__number">4</span>
              <div class="process-step__body">
                <div class="process-step__title-row">
                  <span class="process-step__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                  </span>
                  <h3>Следите за матчем</h3>
                </div>
                <p>Откройте матч и сразу увидите время, соперника, статус и результат.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Атмосферный блок про день матча -->
      <section class="home-section section-padding home-matchday" aria-labelledby="matchday-title">
        <div class="container">
          <div class="row g-4 align-items-center">
            <div class="col-lg-6 order-2 order-lg-1">
              <div class="home-section__heading home-section__heading--left" data-animate="animate__fadeInLeft">
                <p class="home-kicker">В день матча</p>
                <h2 id="matchday-title" class="section-title">В день матча без “а во сколько?”</h2>
              </div>
              <p class="home-matchday__lead">
                Перед игрой обычно начинается одно и то же: кто соперник, где играем, какие правила. Здесь это видно до стартового свистка.
              </p>
              <ul class="home-matchday__list">
                <li>Капитан проверяет состав и заявку.</li>
                <li>Игрок видит время, соперника и место.</li>
                <li>Организатор не собирает ответы вручную.</li>
              </ul>
            </div>
            <div class="col-lg-6 order-1 order-lg-2">
              <figure class="media-frame media-frame--tall" data-animate="animate__fadeInRight" data-animate-delay="120">
                <img
                  src="/assets/img/matchday-team-practice.jpg"
                  sizes="(max-width: 991px) 100vw, 48vw"
                  alt="Любительская команда тренируется на футбольном поле"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      <!-- Ключевые продуктовые разделы -->
      <section class="home-section section-padding" aria-labelledby="features-title">
        <div class="container">
          <div class="home-section__heading" data-animate="animate__fadeInUp">
            <p class="home-kicker">Основные разделы</p>
            <h2 id="features-title" class="section-title">Что нужно для турнира</h2>
          </div>
          <div class="row g-4">
            <div class="col-lg-4">
              <article class="feature-panel" data-animate="animate__fadeInUp">
                <div class="feature-panel__intro">
                  <span class="feature-panel__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M5 6h14v12H5z" /><path d="M8 3v6M16 3v6M5 10h14" /></svg>
                  </span>
                  <div>
                    <h3>Турниры</h3>
                    <p>Смотрите формат, сроки заявки и требования к составу до регистрации.</p>
                  </div>
                </div>
                <ul class="feature-panel__list">
                  <li>Фильтры по виду спорта и статусу</li>
                  <li>Даты сезона, дедлайны и статус набора</li>
                  <li>Переход к заявке и регламенту</li>
                </ul>
                <a class="feature-panel__link" href="/tournaments">Смотреть турниры</a>
              </article>
            </div>
            <div class="col-lg-4">
              <article class="feature-panel" data-animate="animate__fadeInUp" data-animate-delay="120">
                <div class="feature-panel__intro">
                  <span class="feature-panel__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M6 18h12" /><path d="M8 18V9m4 9V5m4 13v-7" /></svg>
                  </span>
                  <div>
                    <h3>Рейтинг</h3>
                    <p>После подтверждённых игр видно, кто поднялся, кто просел и сколько очков у команды.</p>
                  </div>
                </div>
                <ul class="feature-panel__list">
                  <li>Очки, позиции и движение команд</li>
                  <li>Очки только по принятым результатам</li>
                  <li>Правила начисления очков</li>
                </ul>
                <a class="feature-panel__link" href="/ratings">Посмотреть рейтинг</a>
              </article>
            </div>
            <div class="col-lg-4">
              <article class="feature-panel" data-animate="animate__fadeInUp" data-animate-delay="240">
                <div class="feature-panel__intro">
                  <span class="feature-panel__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                  </span>
                  <div>
                    <h3>Результаты и правила</h3>
                    <p>До игры видны время и соперники, после игры — итоговый счёт.</p>
                  </div>
                </div>
                <ul class="feature-panel__list">
                  <li>Статусы встреч и итоговые результаты</li>
                  <li>Правила матча рядом с расписанием</li>
                  <li>Связь матча с турниром и таблицей</li>
                </ul>
                <a class="feature-panel__link" href="/rules">Открыть правила</a>
              </article>
            </div>
          </div>
        </div>
      </section>

      <!-- Персонализированные сценарии для разных ролей -->
      <section class="home-section section-padding" aria-labelledby="roles-title">
        <div class="container">
          <div class="home-section__heading" data-animate="animate__fadeInUp">
            <p class="home-kicker">Кому что нужно</p>
            <h2 id="roles-title" class="section-title">Что важно игроку, капитану и организатору</h2>
          </div>
          <div class="roles-grid">
            <article class="role-card role-card--players" data-animate="animate__fadeInUp">
              <div class="role-card__header">
                <span class="role-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>
                </span>
                <p class="role-card__eyebrow">Игрокам</p>
              </div>
              <h3>Понять, когда и с кем играть</h3>
              <p>Игрок открывает матч и видит главное: когда играем, с кем и по каким правилам.</p>
              <ul>
                <li>Профиль и история участия</li>
                <li>Расписание и регламент рядом</li>
                <li>Переход от матча к результату и рейтингу</li>
              </ul>
            </article>
            <article class="role-card role-card--captains" data-animate="animate__fadeInUp" data-animate-delay="120">
              <div class="role-card__header">
                <span class="role-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M4 19h16" /><path d="M6 16V7l6-3 6 3v9" /><path d="M9.5 10.5h5" /></svg>
                </span>
                <p class="role-card__eyebrow">Капитанам</p>
              </div>
              <h3>Состав и заявка без ручных списков</h3>
              <p>Капитан видит, кто в составе, кто подтвердился и можно ли уже заявляться.</p>
              <ul>
                <li>Приглашения и список игроков</li>
                <li>Проверка состава перед матчем</li>
                <li>Подача в турнир и статус заявки</li>
              </ul>
            </article>
            <article class="role-card role-card--organizers" data-animate="animate__fadeInUp" data-animate-delay="240">
              <div class="role-card__header">
                <span class="role-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M7 5h10v4H7z" /><path d="M8 9v3a4 4 0 0 0 8 0V9" /><path d="M9 19h6" /></svg>
                </span>
                <p class="role-card__eyebrow">Организаторам</p>
              </div>
              <h3>Организатору проще вести турнир</h3>
              <p>Организатор проверяет заявки, назначает матчи и записывает результаты.</p>
              <ul>
                <li>Публикация этапов и дедлайнов</li>
                <li>Связь с командами</li>
                <li>Результаты матчей в турнирной таблице</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <!-- Имиджевый блок с атмосферой командной игры -->
      <section class="home-section section-padding" aria-labelledby="atmosphere-title">
        <div class="container">
          <div class="home-section__heading" data-animate="animate__fadeInUp">
            <p class="home-kicker">Что видит команда</p>
            <h2 id="atmosphere-title" class="section-title">Команда, матч, результат</h2>
            <p class="section-subtitle">Состав подтверждён, матч назначен, результат записан. У каждой игры остаётся своя карточка.</p>
          </div>
          <div class="gallery-grid">
            <figure class="gallery-card gallery-card--wide" data-animate="animate__zoomIn">
              <img
                src="/assets/img/atmosphere-team-energy.jpg"
                sizes="(max-width: 1199px) 100vw, 50vw"
                alt="Игроки участвуют в командном волейбольном матче в зале"
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <strong>Состав собран</strong>
                <span>Игроки знают, кто выходит на матч и кого ещё ждёт капитан.</span>
              </figcaption>
            </figure>
            <figure class="gallery-card" data-animate="animate__zoomIn" data-animate-delay="120">
              <img
                src="/assets/img/atmosphere-match-rhythm.jpg"
                sizes="(max-width: 1199px) 100vw, 33vw"
                alt="Игроки готовятся к любительскому футбольному матчу на поле"
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <strong>Матч назначен</strong>
                <span>Время, соперник и место не теряются в переписке.</span>
              </figcaption>
            </figure>
            <figure class="gallery-card" data-animate="animate__zoomIn" data-animate-delay="240">
              <img
                src="/assets/img/atmosphere-season-results.jpg"
                sizes="(max-width: 1199px) 100vw, 33vw"
                alt="Команда собирается в круг перед матчем в спортивном зале"
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <strong>Результат записан</strong>
                <span>После принятого результата обновляются сетка и рейтинг.</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <!-- Раздел для партнёров и организаторов -->
      <section class="home-section section-padding" aria-labelledby="partners-title">
        <div class="container">
          <div class="partner-band" data-animate="animate__fadeInUp">
            <div class="partner-band__content">
              <p class="home-kicker">Для площадок и лиг</p>
              <h2 id="partners-title" class="section-title">Если вы проводите свои турниры</h2>
              <p>
                Можно договориться о серии матчей, локальной лиге или поддержке турнира. Без длинных презентаций — сначала обсудим формат.
              </p>
              <div class="partner-band__grid">
                <article class="partner-band__card">
                  <h3>Что можно обсудить</h3>
                  <ul>
                    <li>Анонсы турниров и сезонов</li>
                    <li>Локальные лиги и регулярные серии</li>
                    <li>Площадку, клуб или партнёра турнира</li>
                    <li>Контент для игроков и команд</li>
                  </ul>
                </article>
                <article class="partner-band__card">
                  <h3>Кому подойдёт</h3>
                  <ul>
                    <li>Спортивным площадкам и клубам</li>
                    <li>Локальным лигам и школьным турнирам</li>
                    <li>Компаниям, которым интересен местный спорт</li>
                    <li>Организаторам регулярных сезонов</li>
                  </ul>
                </article>
              </div>
            </div>
            <div class="partner-band__actions" aria-label="Связь по партнёрству">
              <div class="partner-band__contact">
                <span>Почта для связи</span>
                <a href="mailto:razryadarena@ya.ru">razryadarena@ya.ru</a>
              </div>
              <a class="cta-button cta-button-primary" href="/partners">Смотреть условия</a>
              <a class="cta-button cta-button-secondary" href="mailto:razryadarena@ya.ru">Написать на почту</a>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ на основе структуры Bootstrap accordion -->
      <section class="home-section section-padding home-faq-section" id="home-faq" aria-labelledby="faq-title">
        <div class="container">
          <div class="home-section__heading" data-animate="animate__fadeInUp">
            <p class="home-kicker">Вопросы</p>
            <h2 id="faq-title" class="section-title">Частые вопросы</h2>
          </div>
          <div class="accordion home-faq" id="homeFaqAccordion">
            <div
              v-for="(item, index) in faqItems"
              :key="item.question"
              class="accordion-item"
              data-animate="animate__fadeInUp"
              :data-animate-delay="index * 80"
            >
              <h2 class="accordion-header" :id="`faq-heading-${index}`">
                <button
                  class="accordion-button"
                  :class="{ collapsed: openFaqIndex !== index }"
                  type="button"
                  :aria-expanded="openFaqIndex === index"
                  :aria-controls="`faq-collapse-${index}`"
                  @click="toggleFaq(index)"
                >
                  {{ item.question }}
                </button>
              </h2>
              <div
                v-show="openFaqIndex === index"
                :id="`faq-collapse-${index}`"
                class="accordion-collapse collapse"
                :class="{ show: openFaqIndex === index }"
                :aria-labelledby="`faq-heading-${index}`"
              >
                <div class="accordion-body">{{ item.answer }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Финальный блок с концентрированным CTA -->
      <section class="home-final-cta section-padding" aria-labelledby="final-cta-title">
        <div class="container">
          <div class="home-final-cta__panel" data-animate="animate__fadeInUp">
            <p class="home-kicker">Первый шаг</p>
            <h2 id="final-cta-title" class="section-title">Выберите турнир или соберите команду</h2>
            <p>После регистрации можно создать команду, найти подходящий турнир и следить за заявкой.</p>
            <div class="home-final-cta__actions">
              <a class="cta-button cta-button-primary" href="/register">Создать аккаунт</a>
              <a class="cta-button cta-button-secondary" href="/tournaments">Смотреть турниры</a>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
