<script setup lang="ts">
import { mockMatches } from '~/data/mock/matches'

useHead({ title: 'Матчи' })
</script>

<template>
  <section class="section-padding">
    <div class="container">
      <PageHead title="Матчи" subtitle="Матч-центр будет показывать расписание, результаты, составы и CS2 veto." />
      <div class="table-block">
        <table class="table table-dark table-hover mb-0">
          <thead>
            <tr>
              <th>Матч</th>
              <th>Спорт</th>
              <th>Время</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="match in mockMatches" :key="match.id">
              <td>{{ match.team1Id }} vs {{ match.team2Id }}</td>
              <td>{{ match.sport }}</td>
              <td>{{ match.scheduledAt }}</td>
              <td>{{ match.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
