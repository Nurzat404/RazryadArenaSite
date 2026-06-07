<script setup lang="ts">
useHead({ title: 'Вход' })

const auth = useAuthStore()
const email = ref('nurz@example.com')
const password = ref('password')

async function submitLogin() {
  await auth.login(email.value, password.value)
  await navigateTo('/profile')
}
</script>

<template>
  <section class="section-padding">
    <div class="container">
      <div class="auth-wrapper">
        <PageHead title="Вход" subtitle="Мок-авторизация для frontend-этапа. Backend подключим позже." />
        <form class="form-panel" @submit.prevent="submitLogin">
          <div class="mb-3">
            <label class="form-label" for="email">Email</label>
            <input id="email" v-model="email" class="form-control" type="email" autocomplete="email">
          </div>
          <div class="mb-4">
            <label class="form-label" for="password">Пароль</label>
            <input id="password" v-model="password" class="form-control" type="password" autocomplete="current-password">
          </div>
          <button class="cta-button cta-button-primary w-100" type="submit">
            Войти
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
