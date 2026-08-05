export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],
  routeRules: {
    '/admin/**': { ssr: false },
    '/profile/**': { ssr: false },
    '/teams/**': { ssr: false },
    '/tournaments/**': { ssr: false }
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/css/main.css',
    '~/assets/css/components.css',
    '~/assets/css/layouts.css',
    '~/assets/css/pages.css',
    '~/assets/css/responsive.css',
    '~/assets/css/home.css'
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: 'ru'
      },
      titleTemplate: '%s | РазрядАрена',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'РазрядАрена помогает вести любительские турниры без путаницы в чатах: заявки, расписание, матчи, результаты и рейтинг.'
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'ru_RU' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/assets/img/logo/razryad_logo_clean.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&display=swap'
        }
      ]
    }
  },
  typescript: {
    strict: true,
    typeCheck: false
  }
})
