<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Мои команды' })
</script>

<template>
  <section>
    <PageHead title="Мои команды" subtitle="Создавайте составы, приглашайте игроков и готовьте команду к заявке." />
    <div class="surface-panel p-4 text-muted-strong">
      Вы пока не состоите в команде. Создайте свою команду или примите приглашение капитана.
    </div>
  </section>
</template>
