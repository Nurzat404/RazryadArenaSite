<script setup lang="ts">
import { ratingService } from '~/services/ratingService'

useHead({ title: 'Рейтинг' })

const ratings = await ratingService.leaderboard()
</script>

<template>
  <section class="section-padding">
    <div class="container">
      <PageHead title="Рейтинг" subtitle="Общий и сезонный рейтинг игроков и команд будет расширяться по структуре бота." />
      <div class="table-block">
        <table class="table table-dark table-hover mb-0">
          <thead>
            <tr>
              <th>Позиция</th>
              <th>Участник</th>
              <th>Тип</th>
              <th>Спорт</th>
              <th>Очки</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in ratings" :key="row.id">
              <td>{{ row.position }}</td>
              <td>{{ row.entityName }}</td>
              <td>{{ row.entityType }}</td>
              <td>{{ row.sport }}</td>
              <td>{{ row.points }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
