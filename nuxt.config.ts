import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    ssr: false,

    buildModules: [
        '@pinia/nuxt',
    ],
    css: ['vuetify/lib/styles/main.sass'],
    build: {
        transpile: ['vuetify']
    },
    vite: {
        server: {
            watch: {
                usePolling: true,
            }
        }
    }

})
