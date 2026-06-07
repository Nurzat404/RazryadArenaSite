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
          Команды помогают игрокам собираться в составы, готовить заявки и держать участие в турнирах под контролем.
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
              Заявки открыты, состав готов к ближайшему турниру.
            </p>
            <a class="cta-button cta-button-secondary w-100" href="/register">Зарегистрироваться</a>
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
              Команда ищет игроков и готовится к сезонной заявке.
            </p>
            <a class="cta-button cta-button-secondary w-100" href="/contacts">Связаться с организатором</a>
          </article>
        </div>
      </div>

      <article class="surface-panel p-4 mt-3">
        <h2 class="h4 mb-2">
          Как команда живёт в сервисе
        </h2>
        <p class="text-muted-strong mb-0">
          В личном кабинете капитан приглашает игроков, назначает роли, отправляет заявку на турнир и следит за проверкой состава.
        </p>
      </article>
    </div>
  </div>
</template>
