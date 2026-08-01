<script setup lang="ts">
useHead({
  title: 'Контакты',
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
          <p class="text-muted-strong mb-0">Напишите, если хотите провести турнир, обсудить партнёрство или сообщить об ошибке.</p>
        </div>
        <div class="row g-3">
          <div class="col-lg-4 col-md-6">
            <article class="contacts-card h-100">
              <h2 class="h5">Куда писать</h2>
              <ul class="comparison-list mb-0">
                <li>Email: <a class="partner-email-link" href="mailto:razryadarena@ya.ru">razryadarena@ya.ru</a></li>
                <li>Отвечаем в рабочее время</li>
              </ul>
            </article>
          </div>
          <div class="col-lg-4 col-md-6">
            <article class="contacts-card h-100">
              <h2 class="h5">По каким вопросам писать</h2>
              <ul class="comparison-list mb-0">
                <li>Ошибка на сайте</li>
                <li>Идея для раздела или турнира</li>
                <li>Запуск турнира</li>
                <li>Партнёрство</li>
              </ul>
            </article>
          </div>
          <div class="col-lg-4 col-md-6">
            <article class="contacts-card h-100">
              <h2 class="h5">Что указать в письме</h2>
              <ul class="comparison-list mb-0">
                <li>Как к вам обращаться</li>
                <li>Название команды или турнира</li>
                <li>Ссылку на страницу, если нашли ошибку</li>
                <li>Короткое описание вопроса</li>
              </ul>
            </article>
          </div>
        </div>
      </div>
  </div>
</template>
