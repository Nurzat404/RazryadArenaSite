<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg'
  closeLabel?: string
  closeOnBackdrop?: boolean
}>(), {
  size: 'md',
  closeLabel: 'Закрыть',
  closeOnBackdrop: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const close = () => emit('update:modelValue', false)
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="base-modal" role="dialog" aria-modal="true" @click.self="closeOnBackdrop && close()">
      <section class="base-modal__panel" :class="`base-modal__panel--${size}`">
        <header class="base-modal__head">
          <h2 v-if="title" class="base-modal__title">{{ title }}</h2>
          <button class="base-modal__close" type="button" :aria-label="closeLabel" @click="close">x</button>
        </header>
        <div class="base-modal__body">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="base-modal__footer">
          <slot name="footer" />
        </footer>
      </section>
    </div>
  </Teleport>
</template>
