<script setup lang="ts">
useHead({
  title: 'Рейтинг — РазрядАрена',
  bodyAttrs: {
    class: 'layout-public',
    'data-page': 'ratings',
    'data-role': 'public'
  }
})
</script>

<template>
  <div class="section-padding">
<div class="container">
        <div class="page-head">
          <h1 class="section-title">Рейтинг команд</h1>
          <p class="section-subtitle">Очки и места меняются после принятых результатов, а не по слухам из чата.</p>
        </div>

        <section class="filter-panel mb-3" data-filter-group>
          <div class="d-flex flex-wrap gap-2">
            <button class="filter-chip is-active" type="button" data-filter-chip>Общий рейтинг</button>
            <button class="filter-chip" type="button" data-filter-chip>Киберспорт</button>
            <button class="filter-chip" type="button" data-filter-chip>Футбол</button>
            <button class="filter-chip" type="button" data-filter-chip>Баскетбол</button>
          </div>
        </section>

        <section class="empty-state-panel mb-3">
          <span class="empty-state-panel__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M6 18h12" /><path d="M8 18V9m4 9V5m4 13v-7" /></svg>
          </span>
          <h2 class="h4 mb-2">Рейтинг сезона</h2>
          <p class="mb-0">
            Сыграли, результат приняли — таблица обновилась. Без ручных пересчётов после каждой игры.
          </p>
          <div class="empty-state-panel__actions">
            <a class="cta-button cta-button-primary" href="/tournaments">Смотреть турниры</a>
            <a class="cta-button cta-button-secondary" href="/rules">Как считается рейтинг</a>
          </div>
        </section>

        <article class="surface-panel p-4">
          <h2 class="h4 mb-2">Что влияет на место в таблице</h2>
          <ul class="comparison-list mb-3">
            <li>Победы, поражения и технические результаты</li>
            <li>Формат турнира и стадия сезона</li>
            <li>Принятый протокол матча</li>
          </ul>
          <div class="d-flex flex-wrap gap-2">
            <a class="cta-button cta-button-primary" href="/rules">Открыть правила</a>
            <a class="cta-button cta-button-secondary" href="/contacts">Написать организатору</a>
          </div>
        </article>
      </div>
  </div>
</template>
