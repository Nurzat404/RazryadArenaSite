<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Пользователи' })
</script>

<template>
  <section>
    <PageHead title="Пользователи" subtitle="Игроки, капитаны, организаторы и доступ к разделам сайта." />
    <div class="surface-panel p-4 text-muted-strong">
      Пользователей пока нет. После первых регистраций можно будет найти игрока и проверить его роль.
    </div>
  </section>
</template>
