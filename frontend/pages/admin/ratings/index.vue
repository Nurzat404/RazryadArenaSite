<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Админка рейтингов' })
</script>

<template>
  <section>
    <PageHead title="Рейтинги" subtitle="Проверяйте сезоны, очки команд и корректность таблиц перед публикацией." />
    <div class="surface-panel p-4 text-muted-strong">
      Здесь будут отображаться рейтинговые таблицы выбранного сезона и действия для проверки результатов.
    </div>
  </section>
</template>
