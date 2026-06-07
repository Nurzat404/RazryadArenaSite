<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Рейтинги в админке' })
</script>

<template>
  <section>
    <PageHead title="Рейтинги" subtitle="Очки команд, сезоны и ручная проверка спорных результатов." />
    <div class="surface-panel p-4 text-muted-strong">
      Рейтингов пока нет. Первые принятые матчи соберут таблицу сезона.
    </div>
  </section>
</template>
