<script setup lang="ts">
useHead({ title: 'Подтверждение почты', bodyAttrs: { class: 'layout-public', 'data-page': 'verify-email', 'data-role': 'public' } })
</script>

<template>
  <section class="section-padding">
    <div class="container">
      <div class="auth-wrapper">
        <div class="surface-panel auth-card p-4 text-center">
          <h1 class="section-title mb-2">Подтверждение почты пока недоступно</h1>
          <p class="section-subtitle mx-auto mb-3">Адрес можно указать в профиле, но подтверждение по ссылке сейчас не работает.</p>
          <NuxtLink class="cta-button cta-button-primary" to="/login">Перейти ко входу</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
