<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

useHead({ title: 'Профиль' })

const auth = useAuthStore()
await auth.loadCurrentUser()
</script>

<template>
  <section>
    <PageHead title="Профиль" subtitle="Личный кабинет подготовлен для следующих этапов." />
    <div class="surface-panel p-4">
      <h2 class="h4">{{ auth.user?.name }}</h2>
      <p class="text-muted-strong mb-1">{{ auth.user?.email }}</p>
      <p class="mb-0">Email подтвержден: {{ auth.user?.emailVerified ? 'да' : 'нет' }}</p>
    </div>
  </section>
</template>
