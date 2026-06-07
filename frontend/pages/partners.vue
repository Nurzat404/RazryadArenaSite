<script setup lang="ts">
useHead({
  title: 'Партнёрам — РазрядАрена',
  bodyAttrs: {
    class: 'layout-public',
    'data-page': 'partners',
    'data-role': 'public'
  }
})
</script>

<template>
  <div class="section-padding">
<div class="container">
        <section class="partners-hero mb-4">
          <div class="row g-3 align-items-center">
            <div class="col-lg-7">
              <span class="hero-eyebrow">Партнёрская программа</span>
              <h1 class="section-title mb-2">Партнёрство с РазрядАрена</h1>
              <p class="text-muted-strong mb-3">
                Площадка открыта для сотрудничества с брендами, клубами и организаторами,
                которым важны любительские турниры и спортивное сообщество.
              </p>
              <a class="cta-button cta-button-primary" href="mailto:razryadarena@ya.ru">Стать партнёром</a>
            </div>
            <div class="col-lg-5">
              <article class="surface-panel p-4 h-100">
                <h2 class="h5 mb-2">Что можно обсудить</h2>
                <ul class="comparison-list mb-0">
                  <li>Интеграции в турниры и контент</li>
                  <li>Поддержка локальных и онлайн-событий</li>
                  <li>Совместные активности для игроков</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section class="mb-4">
          <div class="page-head">
            <h2 class="section-title">Возможные форматы сотрудничества</h2>
            <p class="text-muted-strong mb-0">Выберите направление, которое подходит вашей команде или компании.</p>
          </div>
          <div class="row g-3">
            <div class="col-lg-3 col-md-6">
              <article class="partners-format-card h-100">
                <h3 class="h5">Инфопартнёрство</h3>
                <p class="text-muted-strong mb-0">Поддержка анонсов и совместных публикаций.</p>
              </article>
            </div>
            <div class="col-lg-3 col-md-6">
              <article class="partners-format-card h-100">
                <h3 class="h5">Техническая поддержка</h3>
                <p class="text-muted-strong mb-0">Оборудование, площадки и инфраструктура.</p>
              </article>
            </div>
            <div class="col-lg-3 col-md-6">
              <article class="partners-format-card h-100">
                <h3 class="h5">Локальные турниры</h3>
                <p class="text-muted-strong mb-0">Совместный запуск событий в регионах.</p>
              </article>
            </div>
            <div class="col-lg-3 col-md-6">
              <article class="partners-format-card h-100">
                <h3 class="h5">Контент-проекты</h3>
                <p class="text-muted-strong mb-0">Обучающие и медийные инициативы для сообщества.</p>
              </article>
            </div>
          </div>
        </section>

        <section class="partner-email-panel mb-4" data-component="partner-email-panel">
          <div class="row g-3 align-items-center">
            <div class="col-lg-8">
              <h2 class="section-title h3 mb-2">Как связаться</h2>
              <p class="text-muted-strong mb-0">Напишите кратко: кто вы, чем занимаетесь и какой формат сотрудничества интересен.</p>
            </div>
            <div class="col-lg-4">
              <div class="partner-email-box">
                <a class="partner-email-link d-inline-block mb-2" href="mailto:razryadarena@ya.ru">razryadarena@ya.ru</a>
                <a class="cta-button cta-button-primary w-100 mt-2" href="mailto:razryadarena@ya.ru">Написать на почту</a>
              </div>
            </div>
          </div>
        </section>

        <section class="home-faq">
          <div class="page-head">
            <h2 class="section-title">Короткий FAQ</h2>
          </div>
          <div class="accordion" id="partnersFaqAccordion">
            <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#partnerFaq1">Партнёрская программа уже открыта?</button></h2><div id="partnerFaq1" class="accordion-collapse collapse" data-bs-parent="#partnersFaqAccordion"><div class="accordion-body text-muted-strong">Да. Запрос на сотрудничество можно отправить на почту и обсудить формат напрямую.</div></div></div>
            <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#partnerFaq2">Есть ли готовые пакеты?</button></h2><div id="partnerFaq2" class="accordion-collapse collapse" data-bs-parent="#partnersFaqAccordion"><div class="accordion-body text-muted-strong">Базовые форматы есть, но детали фиксируем вместе под ваши цели.</div></div></div>
            <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#partnerFaq3">Можно предложить свой формат?</button></h2><div id="partnerFaq3" class="accordion-collapse collapse" data-bs-parent="#partnersFaqAccordion"><div class="accordion-body text-muted-strong">Да, в письме можно описать любой удобный вам формат сотрудничества.</div></div></div>
            <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#partnerFaq4">Куда писать по партнёрству?</button></h2><div id="partnerFaq4" class="accordion-collapse collapse" data-bs-parent="#partnersFaqAccordion"><div class="accordion-body text-muted-strong">На почту <a class="link-light" href="mailto:razryadarena@ya.ru">razryadarena@ya.ru</a>.</div></div></div>
          </div>
        </section>
      </div>
  </div>
</template>
