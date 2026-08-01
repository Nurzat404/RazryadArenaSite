<script setup lang="ts">
const auth = useAuthStore()

const email = ref('nurz@example.com')
const password = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  if (!email.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Введите email и пароль.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await auth.login(email.value.trim(), password.value)
    await navigateTo('/profile')
  } catch {
    errorMessage.value = 'Не получилось войти. Проверьте данные и попробуйте ещё раз.'
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Вход',
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
          <p class="text-muted-strong">Войдите, чтобы видеть свои команды, заявки и ближайшие матчи.</p>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label" for="login-email">Email</label>
              <input
                id="login-email"
                v-model="email"
                class="form-control"
                type="email"
                placeholder="you@example.com"
                autocomplete="email"
              >
            </div>
            <div class="mb-3">
              <label class="form-label" for="login-password">Пароль</label>
              <input
                id="login-password"
                v-model="password"
                class="form-control"
                type="password"
                placeholder="Введите пароль"
                autocomplete="current-password"
              >
            </div>
            <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
            <button class="cta-button cta-button-primary w-100 mb-2" type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Входим...' : 'Войти' }}
            </button>
            <a class="cta-button cta-button-secondary w-100 mb-2" href="/register">Создать аккаунт</a>
            <a class="site-footer-link d-inline-flex justify-content-center w-100" href="/forgot-password">Забыли пароль?</a>
          </form>
        </article>
      </div>
    </div>
  </div>
</template>
