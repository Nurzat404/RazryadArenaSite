<script setup lang="ts">
useHead({
  title: 'Контакты — РазрядАрена',
  bodyAttrs: {
    class: 'layout-public',
    'data-page': 'contacts',
    'data-role': 'public'
  }
})
</script>

<template>
  <div class="section-padding">
<div class="container">
        <div class="page-head">
          <h1 class="section-title">Контакты</h1>
          <p class="text-muted-strong mb-0">Связь с командой РазрядАрена по вопросам участия, поддержки и партнёрства.</p>
        </div>
        <div class="row g-3">
          <div class="col-lg-4 col-md-6">
            <article class="contacts-card h-100">
              <h2 class="h5">Основной контакт</h2>
              <ul class="comparison-list mb-0">
                <li>Email: <a class="partner-email-link" href="mailto:razryadarena@ya.ru">razryadarena@ya.ru</a></li>
                <li>Ответ поддержки: в рабочее время</li>
              </ul>
            </article>
          </div>
          <div class="col-lg-4 col-md-6">
            <article class="contacts-card h-100">
              <h2 class="h5">По каким вопросам писать</h2>
              <ul class="comparison-list mb-0">
                <li>Техподдержка и ошибки интерфейса</li>
                <li>Идеи по функционалу</li>
                <li>Организация турниров</li>
                <li>Партнёрство</li>
              </ul>
            </article>
          </div>
          <div class="col-lg-4 col-md-6">
            <article class="contacts-card h-100">
              <h2 class="h5">Дополнительные каналы</h2>
              <ul class="comparison-list mb-0">
                <li>Телефон: по запросу через почту</li>
                <li>Telegram: через поддержку</li>
                <li>VK: через поддержку</li>
                <li>MAX: через поддержку</li>
              </ul>
            </article>
          </div>
        </div>
      </div>
  </div>
</template>
