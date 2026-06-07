<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Рефералка' })
</script>

<template>
  <section>
    <PageHead title="Рефералка" subtitle="Здесь будут ссылки, приглашенные пользователи и начисления." />
    <div class="surface-panel p-4 text-muted-strong">
      Раздел подготовлен для этапа реферальной системы.
    </div>
  </section>
</template>
