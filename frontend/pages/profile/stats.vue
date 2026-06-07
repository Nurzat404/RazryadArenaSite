<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Моя статистика' })
</script>

<template>
  <section>
    <PageHead title="Моя статистика" subtitle="Личная история матчей, участий и результатов по сезонам." />
    <div class="surface-panel p-4 text-muted-strong">
      Статистика пока пустая. После первых матчей здесь появятся сыгранные встречи, результаты и участие в турнирах.
    </div>
  </section>
</template>
