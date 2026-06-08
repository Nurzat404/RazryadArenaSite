<script setup lang="ts">
import { authService } from '~/services/authService'

const email = ref('')
const sent = ref(false)
const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  await authService.requestPasswordReset(email.value.trim())
  sent.value = true
  isSubmitting.value = false
}

useHead({
  title: 'Восстановление пароля — РазрядАрена',
  bodyAttrs: {
    class: 'layout-public',
    'data-page': 'forgot-password',
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
              Восстановление пароля
            </h1>
            <p class="section-subtitle mx-auto mb-0">
              Напишите email от аккаунта. Если он найден, пришлём ссылку для сброса.
            </p>
          </div>
          <div class="mb-4">
            <label class="form-label" for="email">Email</label>
            <input id="email" v-model="email" class="form-control" type="email" autocomplete="email" placeholder="you@example.com" required>
          </div>
          <button class="cta-button cta-button-primary w-100" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Отправляем...' : 'Отправить ссылку' }}
          </button>
          <p v-if="sent" class="form-success mb-0" role="status">
            Готово. Проверьте почту.
          </p>
        </form>
      </div>
    </div>
  </section>
</template>
