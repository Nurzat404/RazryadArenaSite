<script setup lang="ts">
const sports = ['Футбол', 'Баскетбол', 'Волейбол', 'CS2', 'Настольный теннис', 'Шахматы']

const selectedSports = ref<string[]>(['Футбол'])
const submitted = ref(false)

const toggleSport = (sport: string) => {
  submitted.value = false

  if (selectedSports.value.includes(sport)) {
    selectedSports.value = selectedSports.value.filter((item) => item !== sport)
    return
  }

  selectedSports.value = [...selectedSports.value, sport]
}

const handleSubmit = () => {
  submitted.value = true
}

useHead({
  title: 'Регистрация — РазрядАрена',
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
              Зарегистрируйтесь, чтобы собрать команду, подать заявку на турнир и получать всю информацию о матчах в одном месте.
            </p>
          </div>

          <form class="registration-form" @submit.prevent="handleSubmit">
            <section class="form-section" aria-labelledby="account-title">
              <h2 id="account-title" class="form-section__title">
                Данные для входа
              </h2>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label" for="name">Имя</label>
                  <input id="name" class="form-control" type="text" placeholder="Например, Артём" autocomplete="given-name" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="city">Город</label>
                  <input id="city" class="form-control" type="text" placeholder="Ваш город" autocomplete="address-level2" required>
                </div>
                <div class="col-md-8">
                  <label class="form-label" for="email">Email</label>
                  <input id="email" class="form-control" type="email" placeholder="you@example.com" autocomplete="email" required>
                  <div class="form-text">
                    Позже сюда придёт письмо для подтверждения аккаунта.
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label" for="age">Возраст</label>
                  <input id="age" class="form-control" type="number" min="10" max="100" placeholder="18" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="password">Пароль</label>
                  <input id="password" class="form-control" type="password" autocomplete="new-password" placeholder="Минимум 8 символов" minlength="8" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="password-confirm">Повторите пароль</label>
                  <input id="password-confirm" class="form-control" type="password" autocomplete="new-password" placeholder="Повторите пароль" minlength="8" required>
                </div>
              </div>
            </section>
            <section class="form-section" aria-labelledby="sports-title">
              <h2 id="sports-title" class="form-section__title">
                Какие дисциплины вам интересны?
              </h2>
              <p class="form-section__hint">
                Можно выбрать несколько. Это поможет показывать подходящие турниры и команды.
              </p>
              <div class="sport-picker" role="group" aria-label="Выбор дисциплин">
                <button
                  v-for="sport in sports"
                  :key="sport"
                  class="filter-chip sport-chip"
                  :class="{ 'is-active': selectedSports.includes(sport) }"
                  type="button"
                  :aria-pressed="selectedSports.includes(sport)"
                  @click="toggleSport(sport)"
                >
                  {{ sport }}
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
                Я согласен на обработку персональных данных.
              </label>
            </div>

            <button class="cta-button cta-button-primary w-100" type="submit">
              Создать аккаунт
            </button>

            <p v-if="submitted" class="form-success mb-0" role="status">
              Готово. Аккаунт создан, теперь можно перейти к входу и продолжить работу с турнирами.
            </p>
          </form>
        </article>
      </div>
    </div>
  </div>
</template>
