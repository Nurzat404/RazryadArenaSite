<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Команды в админке' })
</script>

<template>
  <section>
    <PageHead title="Команды" subtitle="Составы, капитаны, заявки и ограничения перед турниром." />
    <div class="surface-panel p-4 text-muted-strong">
      Команд пока нет. После первых составов будет видно, кто готов к заявке.
    </div>
  </section>
</template>
