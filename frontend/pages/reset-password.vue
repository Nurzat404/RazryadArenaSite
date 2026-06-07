<script setup lang="ts">
const saved = ref(false)

useHead({
  title: 'Новый пароль — РазрядАрена',
  bodyAttrs: {
    class: 'layout-public',
    'data-page': 'reset-password',
    'data-role': 'public'
  }
})
</script>

<template>
  <section class="section-padding">
    <div class="container">
      <div class="auth-wrapper">
        <form class="form-panel auth-card" @submit.prevent="saved = true">
          <div class="auth-card__head">
            <h1 class="section-title mb-2">
              Новый пароль
            </h1>
            <p class="section-subtitle mx-auto mb-0">
              Придумайте новый пароль для аккаунта. Он должен отличаться от старого и содержать минимум 8 символов.
            </p>
          </div>
          <div class="mb-3">
            <label class="form-label" for="password">Новый пароль</label>
            <input id="password" class="form-control" type="password" autocomplete="new-password" minlength="8" required>
          </div>
          <div class="mb-4">
            <label class="form-label" for="password-confirm">Повторите пароль</label>
            <input id="password-confirm" class="form-control" type="password" autocomplete="new-password" minlength="8" required>
          </div>
          <button class="cta-button cta-button-primary w-100" type="submit">
            Сохранить пароль
          </button>
          <p v-if="saved" class="form-success mb-0" role="status">
            Пароль сохранён. Теперь можно войти в аккаунт с новым паролем.
          </p>
        </form>
      </div>
    </div>
  </section>
</template>
