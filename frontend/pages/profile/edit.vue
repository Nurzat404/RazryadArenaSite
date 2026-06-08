<script setup lang="ts">
import type { SportKey } from '~/types/domain'

definePageMeta({ layout: 'app', middleware: 'auth' })

useHead({
  title: 'Редактировать профиль | РазрядАрена',
  meta: [
    {
      name: 'description',
      content: 'Редактирование профиля игрока РазрядАрены: имя, email, город, возраст, виды спорта и Steam profile.'
    }
  ]
})

const auth = useAuthStore()

if (!auth.initialized) {
  await auth.loadCurrentUser()
}

const sportOptions: Array<{ key: SportKey, label: string }> = [
  { key: 'cs2', label: 'CS2' },
  { key: 'football', label: 'Футбол' },
  { key: 'basketball', label: 'Баскетбол' },
  { key: 'volleyball', label: 'Волейбол' }
]

const form = reactive({
  name: auth.user?.name ?? '',
  email: auth.user?.email ?? '',
  city: auth.user?.city ?? '',
  age: auth.user?.age?.toString() ?? '',
  favoriteSports: [...(auth.user?.favoriteSports ?? [])] as SportKey[],
  steamId: auth.user?.steamId ?? ''
})

const saving = ref(false)
const saved = ref(false)
const errorMessage = ref('')

const toggleSport = (sport: SportKey) => {
  form.favoriteSports = form.favoriteSports.includes(sport)
    ? form.favoriteSports.filter((item) => item !== sport)
    : [...form.favoriteSports, sport]
}

const submitProfile = async () => {
  saved.value = false
  errorMessage.value = ''

  if (!form.name.trim()) {
    errorMessage.value = 'Укажите имя, чтобы капитаны и организаторы понимали, кто в составе.'
    return
  }

  if (!form.email.trim()) {
    errorMessage.value = 'Email нужен для входа. Позже на него будем отправлять подтверждение.'
    return
  }

  const age = form.age.trim() ? Number(form.age) : undefined

  if (age !== undefined && (!Number.isInteger(age) || age < 12 || age > 80)) {
    errorMessage.value = 'Возраст укажите числом от 12 до 80.'
    return
  }

  saving.value = true

  try {
    await auth.updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      city: form.city.trim() || undefined,
      age,
      favoriteSports: form.favoriteSports,
      steamId: form.steamId.trim() || undefined
    })
    saved.value = true
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section>
    <PageHead
      title="Редактировать профиль"
      subtitle="Здесь лежат данные, которые видят капитаны, организаторы и админы турниров."
    />

    <form class="form-panel profile-edit-form" @submit.prevent="submitProfile">
      <div class="form-section">
        <h2 class="form-section__title">Основные данные</h2>
        <p class="form-section__hint">Имя, email, город и возраст помогают быстро проверить заявку на турнир.</p>

        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label" for="profileName">Имя</label>
            <input id="profileName" v-model="form.name" class="form-control" type="text" required>
            <p class="form-text">Обязательное поле.</p>
          </div>

          <div class="col-md-6">
            <label class="form-label" for="profileEmail">Email</label>
            <input id="profileEmail" v-model="form.email" class="form-control" type="email" required>
            <p class="form-text">Обязательное поле. Подтверждение почты подключим позже.</p>
          </div>

          <div class="col-md-6">
            <label class="form-label" for="profileCity">Город</label>
            <input id="profileCity" v-model="form.city" class="form-control" type="text">
            <p class="form-text">По желанию, но для офлайн-турниров это полезно.</p>
          </div>

          <div class="col-md-6">
            <label class="form-label" for="profileAge">Возраст</label>
            <input id="profileAge" v-model="form.age" class="form-control" min="12" max="80" type="number">
            <p class="form-text">По желанию. Нужен там, где у турнира есть возрастные ограничения.</p>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2 class="form-section__title">Виды спорта</h2>
        <p class="form-section__hint">Выберите то, что реально интересно. По этим видам проще подбирать турниры и команды.</p>

        <div class="profile-sport-picker">
          <label
            v-for="sport in sportOptions"
            :key="sport.key"
            class="profile-sport-option"
            :class="{ 'profile-sport-option--active': form.favoriteSports.includes(sport.key) }"
          >
            <input
              type="checkbox"
              :checked="form.favoriteSports.includes(sport.key)"
              @change="toggleSport(sport.key)"
            >
            <span>{{ sport.label }}</span>
          </label>
        </div>
      </div>

      <div class="form-section">
        <h2 class="form-section__title">Steam profile</h2>
        <p class="form-section__hint">Поле по желанию. Для CS2 его лучше заполнить: так проще сверять игроков и demo-статистику.</p>

        <label class="form-label" for="profileSteam">Ссылка на Steam profile или SteamID64</label>
        <input id="profileSteam" v-model="form.steamId" class="form-control" type="text" placeholder="https://steamcommunity.com/id/example">
        <p class="form-text">Не обязательно. Если CS2 не играете, поле можно оставить пустым.</p>
      </div>

      <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
      <p v-if="saved" class="form-success">Профиль сохранён. Изменения уже видны в личном кабинете.</p>

      <div class="profile-form-actions">
        <button class="cta-button cta-button-primary" type="submit" :disabled="saving">
          {{ saving ? 'Сохраняем...' : 'Сохранить профиль' }}
        </button>
        <NuxtLink class="cta-button cta-button-secondary" to="/profile">Вернуться в профиль</NuxtLink>
      </div>
    </form>
  </section>
</template>
