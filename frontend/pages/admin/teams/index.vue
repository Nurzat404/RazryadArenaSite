<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Админка команд' })
</script>

<template>
  <section>
    <PageHead title="Команды" subtitle="Проверяйте составы, капитанов, заявки и ограничения для участия." />
    <div class="surface-panel p-4 text-muted-strong">
      Команды пока не добавлены. Когда капитаны начнут собирать составы, здесь будет видно готовность к турнирам.
    </div>
  </section>
</template>
