<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Турниры в админке' })
</script>

<template>
  <section>
    <PageHead title="Турниры" subtitle="Сезоны, формат, дедлайны и заявки команд." />
    <div class="surface-panel p-4 text-muted-strong">
      Турниров пока нет. Создайте сезон, чтобы открыть набор и принимать заявки.
    </div>
  </section>
</template>
