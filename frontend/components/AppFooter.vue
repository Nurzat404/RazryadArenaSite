<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer py-4">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-3">
          <div class="site-footer-title">
            РазрядАрена
          </div>
          <p class="text-muted-strong mb-0">
            Турниры, команды, расписание и результаты без вечного поиска по чатам.
          </p>
        </div>
        <div class="col-lg-3">
          <div class="site-footer-title">
            Навигация
          </div>
          <div class="d-flex flex-column gap-1">
            <NuxtLink class="site-footer-link" to="/tournaments">
              Турниры
            </NuxtLink>
            <NuxtLink class="site-footer-link" to="/ratings">
              Рейтинг
            </NuxtLink>
            <NuxtLink class="site-footer-link" to="/rules">
              Правила
            </NuxtLink>
            <NuxtLink class="site-footer-link" to="/partners">
              Партнёрам
            </NuxtLink>
          </div>
        </div>
        <div class="col-lg-3">
          <div class="site-footer-title">
            Документы
          </div>
          <div class="d-flex flex-column gap-1">
            <NuxtLink class="site-footer-link" to="/user-agreement">
              Пользовательское соглашение
            </NuxtLink>
            <NuxtLink class="site-footer-link" to="/privacy-consent">
              Согласие на обработку данных
            </NuxtLink>
            <NuxtLink class="site-footer-link" to="/contacts">
              Контакты
            </NuxtLink>
          </div>
        </div>
        <div class="col-lg-3">
          <div class="site-footer-title">
            Контакты
          </div>
          <div class="d-flex flex-column gap-2">
            <a class="site-footer-link" href="mailto:razryadarena@ya.ru">razryadarena@ya.ru</a>
            <NuxtLink class="site-footer-link" to="/contacts">Все контакты</NuxtLink>
          </div>
        </div>
      </div>
      <div class="mt-4 text-muted-strong">
        © {{ year }} РазрядАрена
      </div>
    </div>
  </footer>
</template>
