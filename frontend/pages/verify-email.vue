<script setup lang="ts">
useHead({
  title: 'Подтверждение почты — РазрядАрена',
  bodyAttrs: {
    class: 'layout-public',
    'data-page': 'verify-email',
    'data-role': 'public'
  }
})
</script>

<template>
  <section class="section-padding">
    <div class="container">
      <div class="auth-wrapper">
        <div class="surface-panel auth-card p-4 text-center">
          <h1 class="section-title mb-2">
            Подтверждение почты
          </h1>
          <p class="section-subtitle mx-auto mb-3">
            Почта подтверждена. Теперь можно войти.
          </p>
          <a class="cta-button cta-button-primary" href="/login">
            Войти
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
