<script setup lang="ts">
useHead({ title: 'Новый пароль', bodyAttrs: { class: 'layout-public', 'data-page': 'reset-password', 'data-role': 'public' } })
</script>

<template>
  <section class="section-padding">
    <div class="container">
      <div class="auth-wrapper">
        <div class="surface-panel auth-card p-4 text-center">
          <h1 class="section-title mb-2">Смена пароля пока недоступна</h1>
          <p class="section-subtitle mx-auto mb-3">Эта ссылка не меняет пароль. Вернитесь на страницу входа и используйте данные тестового аккаунта.</p>
          <NuxtLink class="cta-button cta-button-primary" to="/login">Вернуться ко входу</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
