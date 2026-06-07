<script setup lang="ts">
useHead({ title: 'Регистрация' })
</script>

<template>
  <section class="section-padding">
    <div class="container">
      <div class="auth-wrapper">
        <PageHead title="Регистрация" subtitle="Форма подготовлена под будущую email/password авторизацию." />
        <form class="form-panel">
          <div class="mb-3">
            <label class="form-label" for="name">Имя</label>
            <input id="name" class="form-control" type="text" autocomplete="name">
          </div>
          <div class="mb-3">
            <label class="form-label" for="email">Email</label>
            <input id="email" class="form-control" type="email" autocomplete="email">
          </div>
          <div class="mb-4">
            <label class="form-label" for="password">Пароль</label>
            <input id="password" class="form-control" type="password" autocomplete="new-password">
          </div>
          <button class="cta-button cta-button-primary w-100" type="button">
            Создать аккаунт
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
