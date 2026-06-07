<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Мои команды' })
</script>

<template>
  <section>
    <PageHead title="Мои команды" subtitle="Здесь будут команды пользователя, заявки и капитанские действия." />
    <div class="surface-panel p-4 text-muted-strong">
      Раздел подготовлен для этапа команд.
    </div>
  </section>
</template>
