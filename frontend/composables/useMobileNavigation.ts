export const useMobileNavigation = () => {
  const route = useRoute()
  const isOpen = ref(false)

  const close = () => {
    isOpen.value = false
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close()
  }

  watch(() => route.fullPath, close)
  watch(isOpen, (open) => {
    if (import.meta.client) document.body.classList.toggle('mobile-navigation-open', open)
  })

  onMounted(() => document.addEventListener('keydown', handleKeydown))
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.body.classList.remove('mobile-navigation-open')
  })

  return { isOpen, close, toggle }
}
