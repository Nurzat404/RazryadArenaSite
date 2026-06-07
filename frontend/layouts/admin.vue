<script setup lang="ts">
const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/tournaments', label: 'Турниры' },
  { to: '/admin/users', label: 'Пользователи' },
  { to: '/admin/teams', label: 'Команды' },
  { to: '/admin/ratings', label: 'Рейтинги' }
]
</script>

<template>
  <div class="layout-app app-shell">
    <aside class="app-sidebar">
      <NuxtLink class="site-navbar-brand mb-4" to="/">
        <img class="site-logo" src="/assets/img/logo/razryad_logo_clean.png" alt="">
        <span>Админка</span>
      </NuxtLink>
      <nav aria-label="Админ-панель">
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
        <span class="text-muted-strong">Управление платформой</span>
      </div>
      <slot />
    </main>
  </div>
</template>
