<script setup lang="ts">
const auth = useAuthStore()
const { isOpen, close, toggle } = useMobileNavigation()

const handleLogout = async () => {
  close()
  await auth.logout()
  await navigateTo('/')
}

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
          class="navbar-toggler mobile-menu-toggle"
          type="button"
          aria-controls="publicNav"
          :aria-expanded="isOpen"
          aria-label="Открыть меню сайта"
          @click="toggle"
        >
          <span class="navbar-toggler-icon" />
        </button>

        <button
          v-if="isOpen"
          class="mobile-navigation-backdrop"
          type="button"
          aria-label="Закрыть меню"
          @click="close"
        />

        <div id="publicNav" class="navbar-collapse header-main-nav mobile-navigation-panel" :class="{ 'is-open': isOpen }">
          <div class="mobile-navigation-head">
            <strong>Меню</strong>
            <button class="mobile-navigation-close" type="button" aria-label="Закрыть меню" @click="close">×</button>
          </div>
          <ul class="navbar-nav mx-auto align-items-lg-center gap-lg-3">
            <li v-for="link in publicLinks" :key="link.to" class="nav-item">
              <NuxtLink class="site-nav-link" :to="link.to" @click="close">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>

          <div class="d-flex align-items-center gap-2 flex-wrap">
            <template v-if="auth.isAuthenticated">
              <NuxtLink class="cta-button cta-button-secondary" to="/profile" @click="close">
                Кабинет
              </NuxtLink>
              <NuxtLink v-if="auth.isAdmin" class="cta-button cta-button-primary" to="/admin" @click="close">
                Админка
              </NuxtLink>
              <button class="cta-button cta-button-secondary" type="button" @click="handleLogout">
                Выйти
              </button>
            </template>
            <template v-else>
              <NuxtLink class="cta-button cta-button-secondary" to="/login" @click="close">
                Войти
              </NuxtLink>
              <NuxtLink class="cta-button cta-button-primary" to="/register" @click="close">
                Регистрация
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
