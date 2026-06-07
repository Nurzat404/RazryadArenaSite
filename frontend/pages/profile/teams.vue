<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Мои команды' })
</script>

<template>
  <section>
    <PageHead title="Мои команды" subtitle="Составы, приглашения и заявки на турниры." />
    <div class="surface-panel p-4 text-muted-strong">
      Вы пока не в команде. Создайте свою или примите приглашение капитана.
    </div>
  </section>
</template>
