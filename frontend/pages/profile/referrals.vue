<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Приглашения' })
</script>

<template>
  <section>
    <PageHead title="Приглашения" subtitle="Ссылки для игроков, которых вы зовёте на сайт." />
    <div class="surface-panel p-4 text-muted-strong">
      Приглашений пока нет. По ссылке будет видно, кто пришёл на сайт.
    </div>
  </section>
</template>
