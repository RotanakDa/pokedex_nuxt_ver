// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      link: [
        { rel: "icon", type: "assets/images/pokemon-logo.png", href: "/favicon.png" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }
      ]
    }
  }
})
