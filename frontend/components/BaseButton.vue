<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  variant?: ButtonVariant
  size?: ButtonSize
  type?: 'button' | 'submit' | 'reset'
  to?: string
  href?: string
  block?: boolean
  loading?: boolean
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button'
})

const classes = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  {
    'base-button--block': props.block,
    'is-loading': props.loading
  }
])
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="classes" :aria-disabled="disabled || loading">
    <span v-if="loading" class="base-loader base-loader--inline" aria-hidden="true" />
    <slot />
  </NuxtLink>
  <a v-else-if="href" :href="href" :class="classes" :aria-disabled="disabled || loading">
    <span v-if="loading" class="base-loader base-loader--inline" aria-hidden="true" />
    <slot />
  </a>
  <button v-else :class="classes" :type="type" :disabled="disabled || loading">
    <span v-if="loading" class="base-loader base-loader--inline" aria-hidden="true" />
    <slot />
  </button>
</template>
