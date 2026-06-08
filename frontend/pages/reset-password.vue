<script setup lang="ts">
import { authService } from '~/services/authService'

const route = useRoute()
const password = ref('')
const passwordConfirm = ref('')
const saved = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  if (password.value !== passwordConfirm.value) {
    errorMessage.value = 'Пароли не совпадают.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  await authService.resetPassword(String(route.query.token ?? 'mock-token'), password.value)
  saved.value = true
  isSubmitting.value = false
}

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
        <form class="form-panel auth-card" @submit.prevent="handleSubmit">
          <div class="auth-card__head">
            <h1 class="section-title mb-2">
              Новый пароль
            </h1>
            <p class="section-subtitle mx-auto mb-0">
              Придумайте новый пароль. Минимум 8 символов, лучше не такой же, как раньше.
            </p>
          </div>
          <div class="mb-3">
            <label class="form-label" for="password">Новый пароль</label>
            <input id="password" v-model="password" class="form-control" type="password" autocomplete="new-password" minlength="8" required>
          </div>
          <div class="mb-4">
            <label class="form-label" for="password-confirm">Повторите пароль</label>
            <input id="password-confirm" v-model="passwordConfirm" class="form-control" type="password" autocomplete="new-password" minlength="8" required>
          </div>
          <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
          <button class="cta-button cta-button-primary w-100" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Сохраняем...' : 'Сохранить пароль' }}
          </button>
          <p v-if="saved" class="form-success mb-0" role="status">
            Пароль сохранён. Теперь можно войти.
          </p>
        </form>
      </div>
    </div>
  </section>
</template>
