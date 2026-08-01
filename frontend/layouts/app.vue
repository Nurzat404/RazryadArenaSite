<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()

if (!auth.initialized) {
  await auth.loadCurrentUser()
}

const handleLogout = async () => {
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
  { to: '/profile/stats', label: 'Статистика' },
  { to: '/profile/referrals', label: 'Приглашения' }
]

const isActive = (to: string, exact = false) => exact ? route.path === to : route.path === to || route.path.startsWith(`${to}/`)
</script>

<template>
  <div class="layout-app app-shell">
    <aside class="app-sidebar">
      <NuxtLink class="site-navbar-brand mb-4" to="/">
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
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </nav>
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
