<script setup lang="ts">
useHead({
  title: 'Команды — РазрядАрена',
  bodyAttrs: {
    class: 'layout-public',
    'data-page': 'teams',
    'data-role': 'public'
  }
})
</script>

<template>
  <div class="section-padding">
    <div class="container">
      <div class="page-head">
        <h1 class="section-title">
          Команды
        </h1>
        <p class="section-subtitle">
          Соберите состав, назначьте капитана и подавайте заявку без списков в сообщениях.
        </p>
      </div>

      <div class="row g-3">
        <div class="col-lg-6">
          <article class="team-card">
            <div class="card-status-row">
              <strong>Volt5</strong>
              <span class="status-badge is-active">Капитан</span>
            </div>
            <p class="text-muted-strong mb-1">
              Киберспорт • Участников: 5/5
            </p>
            <p class="text-muted-strong">
              Состав полный, можно заявляться на ближайший турнир.
            </p>
            <a class="cta-button cta-button-secondary w-100" href="/register">Создать аккаунт</a>
          </article>
        </div>
        <div class="col-lg-6">
          <article class="team-card">
            <div class="card-status-row">
              <strong>North Hoops</strong>
              <span class="status-badge is-pending">Набор</span>
            </div>
            <p class="text-muted-strong mb-1">
              Баскетбол • Участников: 6/8
            </p>
            <p class="text-muted-strong">
              Команда добирает игроков перед заявкой.
            </p>
            <a class="cta-button cta-button-secondary w-100" href="/contacts">Написать организатору</a>
          </article>
        </div>
      </div>

      <article class="surface-panel p-4 mt-3">
        <h2 class="h4 mb-2">
          Что делает капитан
        </h2>
        <p class="text-muted-strong mb-0">
          Приглашает игроков, проверяет состав и видит, принята заявка или её нужно исправить.
        </p>
      </article>
    </div>
  </div>
</template>
