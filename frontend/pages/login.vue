<script setup lang="ts">
useHead({
  title: 'Вход — РазрядАрена',
  bodyAttrs: {
    class: 'layout-public',
    'data-page': 'login',
    'data-role': 'public'
  }
})
</script>

<template>
  <div class="section-padding">
<div class="container">
        <div class="auth-wrapper">
          <article class="form-panel">
            <h1 class="section-title mb-2">Вход</h1>
            <p class="text-muted-strong">Войдите, чтобы открыть личный кабинет, управлять командой и следить за заявками на турниры.</p>
            <form>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input class="form-control" type="email" placeholder="you@example.com" />
              </div>
              <div class="mb-3">
                <label class="form-label">Пароль</label>
                <input class="form-control" type="password" placeholder="••••••••" />
              </div>
              <button class="cta-button cta-button-primary w-100 mb-2" type="button">Войти</button>
              <a class="cta-button cta-button-secondary w-100 mb-2" href="/register">Создать аккаунт</a>
              <a class="site-footer-link d-inline-flex justify-content-center w-100" href="/forgot-password">Забыли пароль?</a>
            </form>
          </article>
        </div>
      </div>
  </div>
</template>
