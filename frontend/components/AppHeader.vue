<script setup lang="ts">
const auth = useAuthStore()

const publicLinks = [
  { to: '/', label: 'Главная' },
  { to: '/tournaments', label: 'Турниры' },
  { to: '/ratings', label: 'Рейтинг' },
  { to: '/rules', label: 'Правила' },
  { to: '/partners', label: 'Партнёрам' }
]
</script>

<template>
  <header class="site-header site-header-public" data-component="site-header">
    <nav class="navbar navbar-expand-lg navbar-dark" aria-label="Основная навигация">
      <div class="container py-2">
        <NuxtLink class="navbar-brand site-navbar-brand" to="/" aria-label="РазрядАрена, перейти на главную страницу">
          <img class="site-logo" src="/assets/img/logo/razryad_logo_clean.png" alt="Логотип РазрядАрена">
          <span>РазрядАрена</span>
        </NuxtLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#publicNav"
          aria-controls="publicNav"
          aria-expanded="false"
          aria-label="Открыть меню сайта"
        >
          <span class="navbar-toggler-icon" />
        </button>

        <div id="publicNav" class="collapse navbar-collapse header-main-nav">
          <ul class="navbar-nav mx-auto align-items-lg-center gap-lg-3">
            <li v-for="link in publicLinks" :key="link.to" class="nav-item">
              <NuxtLink class="site-nav-link" :to="link.to">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>

          <div class="d-flex align-items-center gap-2 flex-wrap">
            <template v-if="auth.isAuthenticated">
              <NuxtLink class="cta-button cta-button-secondary" to="/profile">
                Кабинет
              </NuxtLink>
              <NuxtLink v-if="auth.isAdmin" class="cta-button cta-button-primary" to="/admin">
                Админка
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink class="cta-button cta-button-secondary" to="/login">
                Войти
              </NuxtLink>
              <NuxtLink class="cta-button cta-button-primary" to="/register">
                Регистрация
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
