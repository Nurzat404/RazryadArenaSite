<script setup lang="ts">
const auth = useAuthStore()

const handleLogout = async () => {
  await auth.logout()
  await navigateTo('/')
}

const links = [
  { to: '/profile', label: 'Профиль' },
  { to: '/profile/teams', label: 'Мои команды' },
  { to: '/profile/tournaments', label: 'Мои турниры' },
  { to: '/profile/stats', label: 'Статистика' },
  { to: '/profile/referrals', label: 'Рефералка' }
]
</script>

<template>
  <div class="layout-app app-shell">
    <aside class="app-sidebar">
      <NuxtLink class="site-navbar-brand mb-4" to="/">
        <img class="site-logo" src="/assets/img/logo/razryad_logo_clean.png" alt="">
        <span>РазрядАрена</span>
      </NuxtLink>
      <nav aria-label="Личный кабинет">
        <NuxtLink v-for="link in links" :key="link.to" class="app-sidebar-link" :to="link.to">
          {{ link.label }}
        </NuxtLink>
      </nav>
    </aside>
    <main class="app-content">
      <div class="app-topbar d-flex justify-content-between align-items-center gap-3">
        <NuxtLink class="site-footer-link" to="/">
          На сайт
        </NuxtLink>
        <div class="d-flex align-items-center gap-3">
          <span class="text-muted-strong">Личный кабинет</span>
          <button class="site-footer-link border-0 bg-transparent p-0" type="button" @click="handleLogout">
            Выйти
          </button>
        </div>
      </div>
      <slot />
    </main>
  </div>
</template>
