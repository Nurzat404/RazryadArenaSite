<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Моя статистика' })
</script>

<template>
  <section>
    <PageHead title="Моя статистика" subtitle="Матчи, результаты и сезоны, где вы играли." />
    <div class="surface-panel p-4 text-muted-strong">
      Статистика пока пустая. Сыграете матч — увидите результат.
    </div>
  </section>
</template>
