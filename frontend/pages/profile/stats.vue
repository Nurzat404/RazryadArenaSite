<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Моя статистика' })
</script>

<template>
  <section>
    <PageHead title="Моя статистика" subtitle="Здесь появятся спортивная статистика и история матчей." />
    <div class="surface-panel p-4 text-muted-strong">
      Раздел подготовлен для этапа статистики.
    </div>
  </section>
</template>
