<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Мои турниры' })
</script>

<template>
  <section>
    <PageHead title="Мои турниры" subtitle="Заявки, подтверждённые участия и ближайшие матчи вашей команды." />
    <div class="surface-panel p-4 text-muted-strong">
      У вас пока нет активных заявок. Выберите турнир и подготовьте команду к участию.
    </div>
  </section>
</template>
