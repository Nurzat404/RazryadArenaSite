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
              <span class="hero-eyebrow">Для площадок и лиг</span>
              <h1 class="section-title mb-2">Проведём турнир вместе</h1>
              <p class="text-muted-strong mb-3">
                Если у вас есть площадка, клуб, лига или идея серии матчей — напишите.
                Сначала разберём формат, потом уже детали.
              </p>
              <a class="cta-button cta-button-primary" href="mailto:razryadarena@ya.ru">Написать на почту</a>
            </div>
            <div class="col-lg-5">
              <article class="surface-panel p-4 h-100">
                <h2 class="h5 mb-2">О чём можно написать</h2>
                <ul class="comparison-list mb-0">
                  <li>Серия матчей или турнир</li>
                  <li>Площадка для игр</li>
                  <li>Призы, анонсы или контент</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section class="mb-4">
          <div class="page-head">
            <h2 class="section-title">Какие форматы подходят</h2>
            <p class="text-muted-strong mb-0">Не обязательно приходить с готовым планом. Достаточно идеи и контакта.</p>
          </div>
          <div class="row g-3">
            <div class="col-lg-3 col-md-6">
              <article class="partners-format-card h-100">
                <h3 class="h5">Инфопартнёрство</h3>
                <p class="text-muted-strong mb-0">Анонсы турниров, посты и новости сезона.</p>
              </article>
            </div>
            <div class="col-lg-3 col-md-6">
              <article class="partners-format-card h-100">
                <h3 class="h5">Техническая поддержка</h3>
                <p class="text-muted-strong mb-0">Площадка, техника, судьи или призы.</p>
              </article>
            </div>
            <div class="col-lg-3 col-md-6">
              <article class="partners-format-card h-100">
                <h3 class="h5">Локальные турниры</h3>
                <p class="text-muted-strong mb-0">Турнир для школы, города, клуба или района.</p>
              </article>
            </div>
            <div class="col-lg-3 col-md-6">
              <article class="partners-format-card h-100">
                <h3 class="h5">Контент-проекты</h3>
                <p class="text-muted-strong mb-0">Материалы для игроков, команд и капитанов.</p>
              </article>
            </div>
          </div>
        </section>

        <section class="partner-email-panel mb-4" data-component="partner-email-panel">
          <div class="row g-3 align-items-center">
            <div class="col-lg-8">
              <h2 class="section-title h3 mb-2">Как связаться</h2>
              <p class="text-muted-strong mb-0">Напишите коротко: кто вы, что хотите провести и в каком городе.</p>
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
            <h2 class="section-title">Короткие ответы</h2>
          </div>
          <div class="accordion" id="partnersFaqAccordion">
            <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#partnerFaq1">Уже можно писать?</button></h2><div id="partnerFaq1" class="accordion-collapse collapse" data-bs-parent="#partnersFaqAccordion"><div class="accordion-body text-muted-strong">Да. Напишите на почту, расскажите про формат — ответим и обсудим дальше.</div></div></div>
            <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#partnerFaq2">Есть готовые пакеты?</button></h2><div id="partnerFaq2" class="accordion-collapse collapse" data-bs-parent="#partnersFaqAccordion"><div class="accordion-body text-muted-strong">Есть базовые варианты, но обычно всё зависит от турнира, города и аудитории.</div></div></div>
            <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#partnerFaq3">Можно предложить свой формат?</button></h2><div id="partnerFaq3" class="accordion-collapse collapse" data-bs-parent="#partnersFaqAccordion"><div class="accordion-body text-muted-strong">Да. Лучше сразу описать идею простыми словами: кто играет, где и зачем.</div></div></div>
            <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#partnerFaq4">Куда писать по партнёрству?</button></h2><div id="partnerFaq4" class="accordion-collapse collapse" data-bs-parent="#partnersFaqAccordion"><div class="accordion-body text-muted-strong">На почту <a class="link-light" href="mailto:razryadarena@ya.ru">razryadarena@ya.ru</a>.</div></div></div>
          </div>
        </section>
      </div>
  </div>
</template>
