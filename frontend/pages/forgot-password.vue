<script setup lang="ts">
useHead({ title: 'Восстановление пароля' })
</script>

<template>
  <section class="section-padding">
    <div class="container">
      <div class="auth-wrapper">
        <PageHead title="Восстановление пароля" subtitle="Заготовка под будущую email-логику backend." />
        <form class="form-panel">
          <div class="mb-4">
            <label class="form-label" for="email">Email</label>
            <input id="email" class="form-control" type="email" autocomplete="email">
          </div>
          <button class="cta-button cta-button-primary w-100" type="button">
            Отправить ссылку
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
