<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Пользователи' })
</script>

<template>
  <section>
    <PageHead title="Пользователи" subtitle="Управляйте аккаунтами, ролями и доступом участников платформы." />
    <div class="surface-panel p-4 text-muted-strong">
      Список пользователей пока пуст. Когда на платформе появятся аккаунты, здесь можно будет быстро найти участника и проверить его доступ.
    </div>
  </section>
</template>
