<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()
const { isOpen, close, toggle } = useMobileNavigation()

if (!auth.initialized) {
  await auth.loadCurrentUser()
}

const handleLogout = async () => {
  close()
  await auth.logout()
  await navigateTo('/')
}

const sectionLinks = [
  { to: '/tournaments', label: 'Турниры' },
  { to: '/teams', label: 'Команды' },
  { to: '/ratings', label: 'Рейтинг' }
]

const accountLinks: Array<{ to: string, label: string, exact?: boolean }> = [
  { to: '/profile', label: 'Профиль', exact: true },
  { to: '/profile/teams', label: 'Мои команды' },
  { to: '/profile/tournaments', label: 'Мои турниры' },
  { to: '/profile/matches', label: 'Мои матчи' },
  { to: '/profile/stats', label: 'Статистика' },
  { to: '/profile/referrals', label: 'Приглашения' }
]

const isActive = (to: string, exact = false) => {
  const openedFromProfileTeams = route.query.from === 'profile-teams' && route.path.startsWith('/teams/')
  if (openedFromProfileTeams && to === '/profile/teams') return true
  if (openedFromProfileTeams && to === '/teams') return false
  return exact ? route.path === to : route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <div class="layout-app app-shell">
    <header class="app-mobile-header navbar-dark">
      <NuxtLink class="site-navbar-brand" to="/" @click="close">
        <img class="site-logo" src="/assets/img/logo/razryad_logo_clean.png" alt="">
        <span>РазрядАрена</span>
      </NuxtLink>
      <button
        class="navbar-toggler mobile-menu-toggle"
        type="button"
        aria-controls="accountNav"
        :aria-expanded="isOpen"
        aria-label="Открыть меню"
        @click="toggle"
      >
        <span class="navbar-toggler-icon" />
      </button>
    </header>

    <button
      v-if="isOpen"
      class="mobile-navigation-backdrop"
      type="button"
      aria-label="Закрыть меню"
      @click="close"
    />

    <aside id="accountNav" class="app-sidebar mobile-navigation-panel" :class="{ 'is-open': isOpen }">
      <div class="mobile-navigation-head">
        <strong>Меню</strong>
        <button class="mobile-navigation-close" type="button" aria-label="Закрыть меню" @click="close">×</button>
      </div>
      <NuxtLink class="site-navbar-brand mb-4" to="/" @click="close">
        <img class="site-logo" src="/assets/img/logo/razryad_logo_clean.png" alt="">
        <span>РазрядАрена</span>
      </NuxtLink>
      <nav aria-label="Навигация">
        <div class="app-sidebar-group">
          <p class="app-sidebar-group-title">Разделы</p>
          <NuxtLink
            v-for="link in sectionLinks"
            :key="link.to"
            class="app-sidebar-link"
            :class="{ 'is-active': isActive(link.to) }"
            :to="link.to"
            @click="close"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
        <div class="app-sidebar-group">
          <p class="app-sidebar-group-title">Аккаунт</p>
          <NuxtLink
            v-for="link in accountLinks"
            :key="link.to"
            class="app-sidebar-link"
            :class="{ 'is-active': isActive(link.to, link.exact) }"
            :to="link.to"
            @click="close"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </nav>
      <div class="app-sidebar-account">
        <span>{{ auth.user?.name }}</span>
        <button type="button" @click="handleLogout">Выйти</button>
      </div>
    </aside>
    <main class="app-content">
      <div class="app-topbar d-flex justify-content-between align-items-center gap-3">
        <NuxtLink class="site-footer-link" to="/">
          Главная
        </NuxtLink>
        <div class="d-flex align-items-center gap-3">
          <span class="text-muted-strong">{{ auth.user?.name }}</span>
          <button class="site-footer-link border-0 bg-transparent p-0" type="button" @click="handleLogout">
            Выйти
          </button>
        </div>
      </div>
      <slot />
    </main>
  </div>
</template>
