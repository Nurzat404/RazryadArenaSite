<script setup lang="ts">
useHead({ title: 'Новый пароль' })
</script>

<template>
  <section class="section-padding">
    <div class="container">
      <div class="auth-wrapper">
        <PageHead title="Новый пароль" subtitle="Маршрут подготовлен для backend-этапа." />
        <form class="form-panel">
          <div class="mb-4">
            <label class="form-label" for="password">Новый пароль</label>
            <input id="password" class="form-control" type="password" autocomplete="new-password">
          </div>
          <button class="cta-button cta-button-primary w-100" type="button">
            Сохранить пароль
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
