<script setup lang="ts">
import { ratingService } from '~/services/ratingService'
import { tournamentService } from '~/services/tournamentService'

useHead({
  title: 'Платформа для любительских турниров'
})

const tournaments = await tournamentService.list()
const ratings = await ratingService.leaderboard()
</script>

<template>
  <section class="home-hero">
    <div class="container">
      <div class="home-hero__shell">
        <div>
          <p class="home-kicker">
            Платформа для любительских турниров
          </p>
          <h1 class="home-hero__title">
            Просто управляйте любительскими турнирами.
          </h1>
          <p class="home-hero__lead">
            Матчи, составы, заявки, правила и рейтинг собраны в одном сервисе.
            Команда быстрее находит нужную информацию, а организатору не нужно держать сезон в таблицах и чатах.
          </p>
          <div class="home-hero__actions">
            <NuxtLink class="cta-button cta-button-primary" to="/register">
              Начать участие
            </NuxtLink>
            <NuxtLink class="cta-button cta-button-secondary" to="/tournaments">
              Смотреть турниры
            </NuxtLink>
          </div>
        </div>
        <figure class="home-hero__media">
          <img
            class="home-hero__image"
            src="/assets/img/hero-team-huddle.jpg"
            alt="Команда собралась в круг на футбольном поле перед матчем"
          >
        </figure>
      </div>
    </div>
  </section>

  <section class="section-padding">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-8">
          <PageHead
            title="Активные турниры"
            subtitle="Первые мок-данные уже идут через сервисный слой, чтобы потом заменить их на Express API."
          />
          <div class="row g-3">
            <div v-for="tournament in tournaments" :key="tournament.id" class="col-md-6">
              <article class="entity-card">
                <span class="status-badge is-active mb-3">{{ tournament.status }}</span>
                <h2 class="h4">{{ tournament.name }}</h2>
                <p class="text-muted-strong">{{ tournament.description }}</p>
                <NuxtLink class="cta-button cta-button-secondary" :to="`/tournaments/${tournament.id}`">
                  Открыть турнир
                </NuxtLink>
              </article>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <PageHead title="Топ рейтинга" />
          <div class="surface-panel p-3">
            <div v-for="row in ratings" :key="row.id" class="d-flex justify-content-between gap-3 py-2">
              <span>{{ row.position }}. {{ row.entityName }}</span>
              <strong>{{ row.points }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
