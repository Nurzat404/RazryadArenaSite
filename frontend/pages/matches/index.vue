<script setup lang="ts">
useHead({
  title: 'Матчи — РазрядАрена',
  bodyAttrs: {
    class: 'layout-public',
    'data-page': 'matches',
    'data-role': 'public'
  }
})
</script>

<template>
  <div class="section-padding">
    <div class="container">
      <div class="page-head">
        <h1 class="section-title">
          Матчи
        </h1>
        <p class="section-subtitle">
          Матч-центр показывает главное без лишних уточнений: соперники, время, место, статус и результат встречи.
        </p>
      </div>

      <section class="filter-panel mb-3">
        <div class="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
          <button class="filter-chip is-active" type="button">Все матчи</button>
          <button class="filter-chip" type="button">Сегодня</button>
          <button class="filter-chip" type="button">Запланированы</button>
          <button class="filter-chip" type="button">Завершены</button>
        </div>
      </section>

      <section class="table-block mb-3">
        <table class="table table-dark-custom">
          <thead>
            <tr>
              <th>Турнир</th>
              <th>Пара</th>
              <th>Дата</th>
              <th>Место</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>RA Open Cup #12</td>
              <td>Volt5 vs Nexus</td>
              <td>06.04 18:30</td>
              <td>Online lobby</td>
              <td><span class="status-badge is-pending">Запланирован</span></td>
            </tr>
            <tr>
              <td>RA Open Cup #12</td>
              <td>Volt5 vs Raven</td>
              <td>08.04 20:00</td>
              <td>LAN Arena #2</td>
              <td><span class="status-badge is-active">Готов к старту</span></td>
            </tr>
            <tr>
              <td>Weekly League</td>
              <td>Volt5 vs Titan</td>
              <td>02.04 19:00</td>
              <td>Online lobby</td>
              <td><span class="status-badge is-completed">Завершён</span></td>
            </tr>
          </tbody>
        </table>
      </section>

      <article class="surface-panel p-4">
        <h2 class="h4 mb-2">
          Что есть на странице матча
        </h2>
        <p class="text-muted-strong mb-3">
          На странице встречи удобно проверить составы, формат игры, место проведения, итоговый счёт и историю изменений.
        </p>
        <div class="d-flex flex-wrap gap-2">
          <a class="cta-button cta-button-primary" href="/tournaments">Открыть турниры</a>
          <a class="cta-button cta-button-secondary" href="/rules">Правила матча</a>
        </div>
      </article>
    </div>
  </div>
</template>
