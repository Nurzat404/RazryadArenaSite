<script setup lang="ts">
const faqItems = [
  {
    question: 'Зачем нужен аккаунт?',
    answer:
      'Чтобы видеть свои команды, заявки и матчи без поиска по чатам.'
  },
  {
    question: 'Можно ли создать команду после регистрации?',
    answer:
      'Да. Сначала регистрируетесь как игрок, а команду создаёте позже в кабинете. Права организатора выдаёт админ.'
  },
  {
    question: 'Как команда подаёт заявку на турнир?',
    answer:
      'Капитан выбирает турнир, проверяет состав и отправляет заявку. Организатор сразу видит, что с ней делать.'
  },
  {
    question: 'Где смотреть расписание и результаты?',
    answer:
      'В матчах видно соперников, время, место и результат. Не нужно листать переписку за прошлую неделю.'
  },
  {
    question: 'Как считается рейтинг?',
    answer:
      'По подтверждённым результатам. Сыграли матч, результат приняли — таблица меняется.'
  },
  {
    question: 'Подойдёт для школьной или городской лиги?',
    answer:
      'Да. Особенно если сейчас всё держится на таблицах, личных сообщениях и закреплённых постах.'
  }
]

const openFaqIndex = ref(0)

const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? -1 : index
}

useHead({
  title: 'РазрядАрена — турниры, команды и матчи без путаницы',
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
              <p class="home-kicker">Любительские турниры без хаоса</p>
              <h1 id="hero-title" class="home-hero__title">Турниры без хаоса в чатах.</h1>
              <p class="home-hero__lead">
                Когда заявки живут в личке, расписание в таблице, а результаты в чате, всё быстро путается.
                РазрядАрена помогает держать сезон в порядке: кто играет, когда матч и что уже сыграно.
              </p>
              <div class="home-hero__actions" aria-label="Основные действия">
                <a class="cta-button cta-button-primary" href="/register">Подать заявку</a>
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
            <p class="home-kicker">Что болит на турнирах</p>
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
                <h3>Рейтинг по делу</h3>
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
            <p class="home-kicker">Как стартовать</p>
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
                <p>Обычный аккаунт игрока. Без выбора “ролей” и лишних настроек на старте.</p>
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
            <h2 id="features-title" class="section-title">То, что обычно теряется по чатам</h2>
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
                  <li>Фильтры по дисциплине и формату</li>
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
                  <li>Правила подсчёта без сюрпризов</li>
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
                    <p>У матча есть время, соперники, статус и итоговый счёт. Всё коротко и по делу.</p>
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
            <h2 id="roles-title" class="section-title">У каждого своя боль</h2>
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
              <h3>Меньше таблиц и ручных сверок</h3>
              <p>Организатор видит заявки, расписание и результаты там, где с ними реально работает.</p>
              <ul>
                <li>Публикация этапов и дедлайнов</li>
                <li>Связь с командами</li>
                <li>Матчи и таблицы без разъезда</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <!-- Имиджевый блок с атмосферой командной игры -->
      <section class="home-section section-padding" aria-labelledby="atmosphere-title">
        <div class="container">
          <div class="home-section__heading" data-animate="animate__fadeInUp">
            <p class="home-kicker">Как это ощущается</p>
            <h2 id="atmosphere-title" class="section-title">Команда, матч, результат</h2>
            <p class="section-subtitle">Любительский турнир может быть шумным, но не должен быть мутным: состав известен, матч назначен, результат записан.</p>
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
                <span>Счёт влияет на таблицу, а не остаётся сообщением в чате.</span>
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
                    <li>Площадку, клуб или бренд в сезоне</li>
                    <li>Контент для игроков и команд</li>
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
            <p class="home-kicker">Начать сезон</p>
            <h2 id="final-cta-title" class="section-title">Начните с команды и заявки</h2>
            <p>Создайте аккаунт, выберите турнир и проверьте состав перед отправкой заявки.</p>
            <div class="home-final-cta__actions">
              <a class="cta-button cta-button-primary" href="/register">Создать аккаунт</a>
              <a class="cta-button cta-button-secondary" href="/tournaments">Смотреть турниры</a>
            </div>
          </div>
        </div>
      </section>
  </div>
</template>
