<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const auth = useAuthStore()
if (!auth.initialized) await auth.loadCurrentUser()
if (auth.user) await navigateTo(`/players/${auth.user.id}/stats`, { replace: true })
</script>

<template>
  <div />
</template>
