<script setup lang="ts">
useHead({
  title: 'Восстановление пароля',
  meta: [{ name: 'description', content: 'Информация о восстановлении доступа к аккаунту РазрядАрены.' }],
  bodyAttrs: { class: 'layout-public', 'data-page': 'forgot-password', 'data-role': 'public' }
})
</script>

<template>
  <section class="section-padding">
    <div class="container">
      <div class="auth-wrapper">
        <div class="surface-panel auth-card p-4 text-center">
          <h1 class="section-title mb-2">Восстановление пароля</h1>
          <p class="section-subtitle mx-auto mb-3">
            Сейчас восстановить пароль через сайт нельзя. Для входа используйте данные тестового аккаунта.
          </p>
          <NuxtLink class="cta-button cta-button-primary" to="/login">Вернуться ко входу</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
