<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Приглашения' })
</script>

<template>
  <section>
    <PageHead title="Приглашения" subtitle="Приглашайте игроков в сервис и следите, кто уже присоединился." />
    <div class="surface-panel p-4 text-muted-strong">
      У вас пока нет приглашённых игроков. Когда появится персональная ссылка, здесь будет история переходов и регистраций.
    </div>
  </section>
</template>
