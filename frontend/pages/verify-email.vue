<script setup lang="ts">
import { authService } from '~/services/authService'

const route = useRoute()
const verified = ref(false)

onMounted(async () => {
  const result = await authService.verifyEmail(String(route.query.token ?? 'mock-token'))
  verified.value = result.success
})

useHead({
  title: 'Подтверждение почты',
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
            {{ verified ? 'Почта подтверждена. Теперь можно войти.' : 'Проверяем ссылку подтверждения.' }}
          </p>
          <a class="cta-button cta-button-primary" href="/login">
            Войти
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
