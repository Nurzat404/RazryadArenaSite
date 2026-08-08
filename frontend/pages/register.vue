<script setup lang="ts">
import type { SportKey } from '~/types/domain'

const auth = useAuthStore()
const route = useRoute()

const sports: Array<{ label: string; value: SportKey }> = [
  { label: 'Футбол', value: 'football' },
  { label: 'Баскетбол', value: 'basketball' },
  { label: 'Волейбол', value: 'volleyball' },
  { label: 'CS2', value: 'cs2' }
]

const form = reactive({
  name: '',
  city: '',
  email: '',
  age: '',
  password: '',
  passwordConfirm: '',
  steamProfileUrl: ''
})

const selectedSports = ref<SportKey[]>(['football'])
const isSubmitting = ref(false)
const errorMessage = ref('')
const destination = computed(() => {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/profile'
  return redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/profile'
})

const toggleSport = (sport: SportKey) => {
  errorMessage.value = ''

  if (selectedSports.value.includes(sport)) {
    selectedSports.value = selectedSports.value.filter((item) => item !== sport)
    return
  }

  selectedSports.value = [...selectedSports.value, sport]
}

const handleSubmit = async () => {
  if (!selectedSports.value.length) {
    errorMessage.value = 'Выберите хотя бы один вид спорта.'
    return
  }

  if (form.password !== form.passwordConfirm) {
    errorMessage.value = 'Пароли не совпадают.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await auth.register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      city: form.city.trim(),
      age: Number(form.age),
      favoriteSports: selectedSports.value,
      steamProfileUrl: selectedSports.value.includes('cs2') && form.steamProfileUrl.trim()
        ? form.steamProfileUrl.trim()
        : undefined
    })
    await navigateTo(destination.value)
  } catch (error) {
    errorMessage.value = error instanceof Error && error.message === 'Email already exists'
      ? 'Аккаунт с таким email уже существует.'
      : 'Не получилось создать аккаунт. Проверьте поля и попробуйте ещё раз.'
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Регистрация',
  meta: [{ name: 'description', content: 'Регистрация игрока для участия в командах и турнирах РазрядАрены.' }],
  bodyAttrs: {
    class: 'layout-public',
    'data-page': 'register',
    'data-role': 'public'
  }
})
</script>

<template>
  <div class="section-padding">
    <div class="container">
      <div class="auth-wrapper auth-wrapper--wide">
        <article class="form-panel auth-card">
          <div class="auth-card__head">
            <h1 class="section-title mb-2">
              Создать аккаунт
            </h1>
            <p class="section-subtitle mx-auto mb-0">
              Создайте аккаунт игрока. Команду можно собрать позже, когда будете готовы подать заявку.
            </p>
          </div>

          <form class="registration-form" @submit.prevent="handleSubmit">
            <section class="form-section" aria-labelledby="account-title">
              <h2 id="account-title" class="form-section__title">
                Данные для входа
              </h2>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label" for="name">Имя <span class="text-muted-strong">(обязательно)</span></label>
                  <input id="name" v-model="form.name" class="form-control" type="text" placeholder="Например, Артём" autocomplete="given-name" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="city">Город <span class="text-muted-strong">(обязательно)</span></label>
                  <input id="city" v-model="form.city" class="form-control" type="text" placeholder="Ваш город" autocomplete="address-level2" required>
                </div>
                <div class="col-md-8">
                  <label class="form-label" for="email">Email <span class="text-muted-strong">(обязательно)</span></label>
                  <input id="email" v-model="form.email" class="form-control" type="email" placeholder="you@example.com" autocomplete="email" required>
                  <div class="form-text">Этот адрес понадобится для входа.</div>
                </div>
                <div class="col-md-4">
                  <label class="form-label" for="age">Возраст <span class="text-muted-strong">(обязательно)</span></label>
                  <input id="age" v-model="form.age" class="form-control" type="number" min="10" max="100" placeholder="18" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="password">Пароль <span class="text-muted-strong">(обязательно)</span></label>
                  <input id="password" v-model="form.password" class="form-control" type="password" autocomplete="new-password" placeholder="Минимум 8 символов" minlength="8" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="password-confirm">Повторите пароль <span class="text-muted-strong">(обязательно)</span></label>
                  <input id="password-confirm" v-model="form.passwordConfirm" class="form-control" type="password" autocomplete="new-password" placeholder="Повторите пароль" minlength="8" required>
                </div>
                <div v-if="selectedSports.includes('cs2')" class="col-12">
                  <label class="form-label" for="steam-id">Ссылка на Steam-профиль <span class="text-muted-strong">(по желанию)</span></label>
                  <input id="steam-id" v-model="form.steamProfileUrl" class="form-control" type="url" placeholder="https://steamcommunity.com/id/..." autocomplete="off">
                  <div class="form-text">
                    Поможет организатору сверить игрока перед CS2-матчем. Ссылку можно добавить позже.
                  </div>
                </div>
              </div>
            </section>
            <section class="form-section" aria-labelledby="sports-title">
              <h2 id="sports-title" class="form-section__title">
                Любимые виды спорта
              </h2>
              <p class="form-section__hint">
                Выберите виды спорта, в которых хотите участвовать.
              </p>
              <div class="sport-picker" role="group" aria-label="Выбор видов спорта">
                <button
                  v-for="sport in sports"
                  :key="sport.value"
                  class="filter-chip sport-chip"
                  :class="{ 'is-active': selectedSports.includes(sport.value) }"
                  type="button"
                  :aria-pressed="selectedSports.includes(sport.value)"
                  @click="toggleSport(sport.value)"
                >
                  {{ sport.label }}
                </button>
              </div>
            </section>

            <div class="form-check mb-2">
              <input id="agreement" class="form-check-input" type="checkbox" required>
              <label class="form-check-label" for="agreement">
                Я принимаю <a class="link-light" href="/user-agreement">пользовательское соглашение</a>.
              </label>
            </div>
            <div class="form-check mb-3">
              <input id="privacy" class="form-check-input" type="checkbox" required>
              <label class="form-check-label" for="privacy">
                Я согласен на <a class="link-light" href="/privacy-consent">обработку персональных данных</a>.
              </label>
            </div>

            <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>

            <button class="cta-button cta-button-primary w-100" type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Создаём...' : 'Создать аккаунт' }}
            </button>
          </form>
        </article>
      </div>
    </div>
  </div>
</template>
