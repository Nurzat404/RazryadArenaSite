<script setup lang="ts">
const faqItems = [
  {
    question: 'Что даёт аккаунт в РазрядАрене?',
    answer:
      'После регистрации у вас появляется личный кабинет: там удобно следить за турнирами, матчами, заявками и командами, в которых вы участвуете.'
  },
  {
    question: 'Можно ли создать команду после регистрации?',
    answer:
      'Да. Сначала создаётся обычный аккаунт игрока, а команду можно собрать позже в личном кабинете. Организаторские права выдаёт администратор.'
  },
  {
    question: 'Как команда подаёт заявку на турнир?',
    answer:
      'Капитан выбирает турнир, проверяет состав и отправляет заявку. Организатор видит её статус и может подтвердить участие или попросить исправить данные.'
  },
  {
    question: 'Где смотреть расписание и результаты?',
    answer:
      'Матчи, соперники, время встречи, место проведения и итоговый результат собраны в матч-центре и связаны со страницей турнира.'
  },
  {
    question: 'Как считается рейтинг?',
    answer:
      'Рейтинг опирается на подтверждённые результаты матчей и правила конкретного сезона. Так команды видят не просто место в таблице, а понятную историю своего движения.'
  },
  {
    question: 'Подойдёт ли платформа для школьной или городской лиги?',
    answer:
      'Да. РазрядАрена рассчитана на любительские турниры: школьные сезоны, локальные лиги, корпоративные соревнования и небольшие серии матчей.'
  }
]

const openFaqIndex = ref(0)

const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? -1 : index
}

useHead({
  title: 'РазрядАрена — платформа для любительских турниров и команд',
  bodyAttrs: {
    class: 'layout-public home-landing',
    'data-page': 'home',
    'data-role': 'public'
  }
})
</script>

<template>
  <div>
<!-- Главный экран с более компактной продуктовой подачей -->
      <section class="home-hero" aria-labelledby="hero-title">
        <div class="container">
          <div class="home-hero__shell">
            <div class="home-hero__content" data-animate="animate__fadeInUp">
              <p class="home-kicker">Платформа для любительских турниров</p>
              <h1 id="hero-title" class="home-hero__title">Турниры без хаоса в чатах.</h1>
              <p class="home-hero__lead">
                РазрядАрена собирает команды, заявки, расписание, правила и результаты в одном месте.
                Игроки быстро понимают, когда и с кем играют, а организатор ведёт сезон без бесконечных таблиц.
              </p>
              <div class="home-hero__actions" aria-label="Основные действия">
                <a class="cta-button cta-button-primary" href="/register">Начать участие</a>
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
                <strong>Команда видит матч, состав и статус турнира на одном экране</strong>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <!-- Короткий блок выгод с акцентом на рабочую пользу -->
      <section class="home-section home-benefits section-padding" aria-labelledby="benefits-title">
        <div class="container">
          <div class="home-section__heading" data-animate="animate__fadeInUp">
            <p class="home-kicker">Почему это удобно</p>
            <h2 id="benefits-title" class="section-title">Понятный порядок для игроков и организаторов</h2>
            <p class="section-subtitle">Сервис помогает не терять важное: кто играет, когда дедлайн, какой состав заявлен и как меняется турнирная таблица.</p>
          </div>
          <div class="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4">
            <div class="col">
              <article class="benefit-card" data-animate="animate__fadeInUp">
                <span class="benefit-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M5 6.5h14M5 12h14M5 17.5h9" /></svg>
                </span>
                <h3>Расписание перед глазами</h3>
                <p>Игроки видят даты матчей, дедлайны заявок и переносы без поиска по перепискам.</p>
              </article>
            </div>
            <div class="col">
              <article class="benefit-card" data-animate="animate__fadeInUp" data-animate-delay="90">
                <span class="benefit-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M7 4h10l3 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8l3-4Z" /><path d="M9 11h6M9 15h4" /></svg>
                </span>
                <h3>Состав без путаницы</h3>
                <p>Капитан понимает, кто в команде, кто подтвердил участие и готова ли заявка к отправке.</p>
              </article>
            </div>
            <div class="col">
              <article class="benefit-card" data-animate="animate__fadeInUp" data-animate-delay="180">
                <span class="benefit-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 4l7 3.5v5c0 4.2-2.8 7.9-7 9.5-4.2-1.6-7-5.3-7-9.5v-5L12 4Z" /><path d="M9.5 12.5 11 14l3.5-3.5" /></svg>
                </span>
                <h3>Регламент рядом</h3>
                <p>Формат турнира, правила матча и условия участия лежат там же, где заявки и расписание.</p>
              </article>
            </div>
            <div class="col">
              <article class="benefit-card" data-animate="animate__fadeInUp" data-animate-delay="270">
                <span class="benefit-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M6 18h12M8 18V9m4 9V5m4 13v-7" /></svg>
                </span>
                <h3>Рейтинг по делу</h3>
                <p>Команды видят своё место в сезоне и понимают, какие результаты влияют на таблицу.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <!-- Пошаговая логика входа в продукт -->
      <section class="home-section home-process section-padding" aria-labelledby="process-title">
        <div class="container">
          <div class="home-section__heading" data-animate="animate__fadeInUp">
            <p class="home-kicker">Как работает платформа</p>
            <h2 id="process-title" class="section-title">Как команда входит в сезон</h2>
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
                <p>Создайте обычный аккаунт игрока, чтобы участвовать в турнирах и управлять своим профилем.</p>
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
                <p>После входа можно создать команду, пригласить игроков и подготовить состав к заявке.</p>
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
                <p>Перед заявкой команда видит требования к составу, формат матчей и правила сезона.</p>
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
                <p>Расписание, статус встречи, результат и движение по таблице остаются связаны между собой.</p>
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
                <h2 id="matchday-title" class="section-title">В день матча вся команда смотрит в один экран</h2>
              </div>
              <p class="home-matchday__lead">
                Перед игрой не должно быть десяти уточнений в чате. У команды есть один понятный маршрут: открыть матч, проверить состав, посмотреть правила и выйти на игру.
              </p>
              <ul class="home-matchday__list">
                <li>Капитан проверяет состав и готовность заявки перед стартом.</li>
                <li>Игрок быстро находит время, соперника, место и правила встречи.</li>
                <li>Организатор видит заявки, расписание и регламент в одной системе.</li>
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
            <p class="home-kicker">Функции платформы</p>
            <h2 id="features-title" class="section-title">Разделы, которые закрывают весь сезон</h2>
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
                    <p>Откройте подходящий турнир, посмотрите формат и проверьте условия участия.</p>
                  </div>
                </div>
                <ul class="feature-panel__list">
                  <li>Фильтры по дисциплине и формату</li>
                  <li>Даты сезона, дедлайны и статус набора</li>
                  <li>Быстрый переход к заявке и регламенту</li>
                </ul>
                <a class="feature-panel__link" href="/tournaments">Открыть раздел турниров</a>
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
                    <p>Таблица помогает понять, как команда идёт по сезону и что изменилось после матчей.</p>
                  </div>
                </div>
                <ul class="feature-panel__list">
                  <li>Очки, позиции и движение команд</li>
                  <li>Связь рейтинга с подтверждёнными матчами</li>
                  <li>Понятные правила подсчёта</li>
                </ul>
                <a class="feature-panel__link" href="/ratings">Перейти к рейтингу</a>
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
                    <p>Каждая встреча получает понятный статус: когда игра, кто участвует и чем всё закончилось.</p>
                  </div>
                </div>
                <ul class="feature-panel__list">
                  <li>Статусы встреч и итоговые результаты</li>
                  <li>Правила матча рядом с расписанием</li>
                  <li>Связь матча с турниром и таблицей</li>
                </ul>
                <a class="feature-panel__link" href="/rules">Изучить правила</a>
              </article>
            </div>
          </div>
        </div>
      </section>

      <!-- Персонализированные сценарии для разных ролей -->
      <section class="home-section section-padding" aria-labelledby="roles-title">
        <div class="container">
          <div class="home-section__heading" data-animate="animate__fadeInUp">
            <p class="home-kicker">Роли пользователей</p>
            <h2 id="roles-title" class="section-title">Каждый участник видит своё</h2>
          </div>
          <div class="roles-grid">
            <article class="role-card role-card--players" data-animate="animate__fadeInUp">
              <div class="role-card__header">
                <span class="role-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>
                </span>
                <p class="role-card__eyebrow">Игрокам</p>
              </div>
              <h3>Быстрый доступ к игре</h3>
              <p>Игроку не нужно спрашивать одно и то же в чате: время, соперник и правила доступны на странице матча.</p>
              <ul>
                <li>Профиль и история участия</li>
                <li>Расписание и регламент в одном месте</li>
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
              <h3>Состав и заявка под контролем</h3>
              <p>Капитан собирает состав, следит за готовностью игроков и отправляет заявку без ручных списков.</p>
              <ul>
                <li>Приглашения и роли участников</li>
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
              <h3>Турнир без ручной сборки</h3>
              <p>Организатор получает рабочее место для сезона: заявки, расписание, правила и результаты не разъезжаются по разным каналам.</p>
              <ul>
                <li>Публикация этапов и дедлайнов</li>
                <li>Коммуникация с командами</li>
                <li>Единая логика для матчей и таблиц</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <!-- Имиджевый блок с атмосферой командной игры -->
      <section class="home-section section-padding" aria-labelledby="atmosphere-title">
        <div class="container">
          <div class="home-section__heading" data-animate="animate__fadeInUp">
            <p class="home-kicker">Атмосфера проекта</p>
            <h2 id="atmosphere-title" class="section-title">Визуальный образ командной игры, матча и результата</h2>
            <p class="section-subtitle">Командный спорт держится на понятных ролях, ритме матча и честно зафиксированном результате. Такой же порядок должен быть и в сервисе.</p>
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
                <strong>Командная энергия</strong>
                <span>Когда состав готов, правила понятны, а каждый игрок знает свою задачу.</span>
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
                <strong>Ритм матча</strong>
                <span>Матч проще провести, когда время, соперник и место не теряются в переписке.</span>
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
                <strong>Итоги сезона</strong>
                <span>Результаты важны не только в день игры: они формируют таблицу и историю сезона.</span>
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
              <p class="home-kicker">Партнёрский раздел</p>
              <h2 id="partners-title" class="section-title">Партнёрство для арен, лиг и локальных брендов</h2>
              <p>
                РазрядАрена помогает локальным лигам и площадкам проводить турниры понятнее: с расписанием, заявками, результатами и местом для партнёрских интеграций.
              </p>
              <div class="partner-band__grid">
                <article class="partner-band__card">
                  <h3>Что можно обсудить</h3>
                  <ul>
                    <li>Совместные анонсы турниров и сезонов</li>
                    <li>Поддержку локальных лиг и регулярных серий</li>
                    <li>Интеграцию площадки, клуба или бренда</li>
                    <li>Полезный контент для игроков и команд</li>
                  </ul>
                </article>
                <article class="partner-band__card">
                  <h3>Кому подойдёт</h3>
                  <ul>
                    <li>Спортивным площадкам и клубам</li>
                    <li>Локальным лигам и школьным турнирам</li>
                    <li>Брендам с фокусом на локальное комьюнити</li>
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
              <a class="cta-button cta-button-primary" href="/partners">Условия партнёрства</a>
              <a class="cta-button cta-button-secondary" href="mailto:razryadarena@ya.ru">Обсудить сотрудничество</a>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ на основе структуры Bootstrap accordion -->
      <section class="home-section section-padding home-faq-section" id="home-faq" aria-labelledby="faq-title">
        <div class="container">
          <div class="home-section__heading" data-animate="animate__fadeInUp">
            <p class="home-kicker">FAQ</p>
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
            <p class="home-kicker">Начать сезон</p>
            <h2 id="final-cta-title" class="section-title">Соберите команду и доведите сезон до результата</h2>
            <p>Начните с аккаунта, выберите турнир, подготовьте состав и следите за матчами без лишней путаницы.</p>
            <div class="home-final-cta__actions">
              <a class="cta-button cta-button-primary" href="/register">Зарегистрироваться</a>
              <a class="cta-button cta-button-secondary" href="/tournaments">Открыть турниры</a>
            </div>
          </div>
        </div>
      </section>
  </div>
</template>
