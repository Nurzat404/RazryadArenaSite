<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Админка турниров' })
</script>

<template>
  <section>
    <PageHead title="Турниры" subtitle="Создавайте сезоны, настраивайте формат, дедлайны и условия участия." />
    <div class="surface-panel p-4 text-muted-strong">
      Турниры ещё не добавлены. После создания сезона здесь появятся карточки с настройками, заявками и статусом набора.
    </div>
  </section>
</template>
