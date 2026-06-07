<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Мои турниры' })
</script>

<template>
  <section>
    <PageHead title="Мои турниры" subtitle="Заявки, подтверждённые участия и ближайшие игры." />
    <div class="surface-panel p-4 text-muted-strong">
      Активных заявок пока нет. Выберите турнир и проверьте состав команды.
    </div>
  </section>
</template>
