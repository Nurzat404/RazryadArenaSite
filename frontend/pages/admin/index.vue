<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

useHead({ title: 'Админ-панель' })

const auth = useAuthStore()
await auth.loadCurrentUser()
</script>

<template>
  <section>
    <PageHead title="Админ-панель" subtitle="Центр управления турнирами, командами, заявками, пользователями и рейтингами." />
    <div class="row g-3">
      <div class="col-md-4">
        <div class="entity-card">
          <h2 class="h5">Турниры</h2>
          <p class="text-muted-strong mb-0">Создание, редактирование и заявки.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="entity-card">
          <h2 class="h5">Команды</h2>
          <p class="text-muted-strong mb-0">Составы, капитаны и блокировки.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="entity-card">
          <h2 class="h5">Рейтинги</h2>
          <p class="text-muted-strong mb-0">Ручные корректировки и сезоны.</p>
        </div>
      </div>
    </div>
  </section>
</template>
