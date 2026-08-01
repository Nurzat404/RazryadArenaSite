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
    <PageHead title="Админ-панель" subtitle="Создание турниров, проверка заявок, команды и результаты матчей." />
    <div class="row g-3">
      <div class="col-md-4">
        <div class="entity-card">
          <h2 class="h5">Турниры</h2>
          <p class="text-muted-strong mb-0">Создать сезон, открыть набор, проверить заявки.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="entity-card">
          <h2 class="h5">Команды</h2>
          <p class="text-muted-strong mb-0">Составы, капитаны, заявки и ограничения.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="entity-card">
          <h2 class="h5">Рейтинги</h2>
          <p class="text-muted-strong mb-0">Очки, сезоны и спорные результаты.</p>
        </div>
      </div>
    </div>
  </section>
</template>
