// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  // SPA mode - SSR disabled
  ssr: false,

  devtools: { enabled: process.env.NODE_ENV === "development" },

  app: {
    head: {
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api",
    },
  },

  modules: [
    "@pinia/nuxt",
    // '@vite-pwa/nuxt'  // Temporarily disabled
  ],

  // PWA settings (module disabled, settings kept for future use)
  // @ts-expect-error - PWA module temporarily disabled
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Yasna - Club Management",
      short_name: "Yasna",
      description: "Rhythmic gymnastics club management app",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      // Caching strategy for API requests
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.yasna\..*\/.*/i,
          handler: "NetworkFirst",
          options: {
            cacheName: "yasna-api-cache",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24, // 24 hours
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  build: {
    transpile: ["vuetify"],
  },

  vite: {
    ssr: {
      noExternal: ["vuetify"],
    },
  },
});
