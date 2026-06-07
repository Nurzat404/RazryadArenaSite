<script setup lang="ts">
useHead({
  title: 'Турниры — РазрядАрена',
  bodyAttrs: {
    class: 'layout-public',
    'data-page': 'tournaments',
    'data-role': 'public'
  }
})
</script>

<template>
  <div class="section-padding">
<div class="container">
        <div class="page-head">
          <h1 class="section-title">Турниры</h1>
          <p class="section-subtitle">Откройте сезон, посмотрите формат и выберите турнир, в котором вашей команде удобно участвовать.</p>
        </div>

        <section class="filter-panel mb-3" data-filter-group>
          <div class="d-flex flex-wrap gap-2">
            <button class="filter-chip is-active" type="button" data-filter-chip>Все дисциплины</button>
            <button class="filter-chip" type="button" data-filter-chip>Киберспорт</button>
            <button class="filter-chip" type="button" data-filter-chip>Футбол</button>
            <button class="filter-chip" type="button" data-filter-chip>Баскетбол</button>
            <button class="filter-chip" type="button" data-filter-chip>Волейбол</button>
          </div>
        </section>

        <div class="row g-3">
          <div class="col-lg-7">
            <article class="empty-state-panel h-100">
              <span class="empty-state-panel__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M5 6h14v12H5z" /><path d="M8 3v6M16 3v6M5 10h14" /></svg>
              </span>
              <h2 class="h4 mb-2">Сейчас открыт набор заявок</h2>
              <p class="mb-0">
                Выберите дисциплину и перейдите к регистрации. После входа команда сможет подготовить состав и отправить заявку на участие.
              </p>
              <div class="empty-state-panel__actions">
                <a class="cta-button cta-button-primary" href="/register">Зарегистрироваться</a>
                <a class="cta-button cta-button-secondary" href="/rules">Посмотреть правила</a>
              </div>
            </article>
          </div>
          <div class="col-lg-5">
            <article class="surface-panel p-4 h-100">
              <h2 class="h4 mb-2">На что смотреть перед заявкой</h2>
              <ul class="comparison-list mb-4">
                <li>Дисциплина, формат сезона и статус набора</li>
                <li>Даты матчей, дедлайн заявки и требования к составу</li>
                <li>Регламент, ограничения и условия участия</li>
              </ul>
              <div class="d-flex flex-wrap gap-2">
                <a class="cta-button cta-button-primary" href="/register">Зарегистрироваться</a>
                <a class="cta-button cta-button-secondary" href="/contacts">Связаться с организатором</a>
              </div>
            </article>
          </div>
        </div>
      </div>
  </div>
</template>
