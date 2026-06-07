<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  message: string
  tone?: 'info' | 'success' | 'warning' | 'danger'
  closable?: boolean
}>(), {
  tone: 'info',
  closable: true
})

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <aside class="base-toast" :class="`base-toast--${tone}`" role="status">
    <div>
      <strong v-if="title">{{ title }}</strong>
      <p>{{ message }}</p>
    </div>
    <button v-if="closable" type="button" aria-label="Закрыть уведомление" @click="emit('close')">x</button>
  </aside>
</template>
