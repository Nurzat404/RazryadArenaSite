<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Мои турниры' })
</script>

<template>
  <section>
    <PageHead title="Мои турниры" subtitle="Здесь будут заявки, одобренные турниры и расписание команды." />
    <div class="surface-panel p-4 text-muted-strong">
      Раздел подготовлен для этапа турниров.
    </div>
  </section>
</template>
