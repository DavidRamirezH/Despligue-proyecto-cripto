import { isProduction } from 'std-env'
import { appRules, landingRules } from './config/routes-rules'
// Function to extract hostname from a URL
const replaceHttpWithWs = (url) => {
  if (url.startsWith('http://')) {
    return url.replace('http://', 'ws://')
  }
  if (url.startsWith('https://')) {
    return url.replace('https://', 'wss://')
  }
  return url
}

const wsUrl = replaceHttpWithWs(process.env.APP_PUBLIC_URL)

export default defineNuxtConfig({
  extends: [
    '../layers/mash',
    '../layers/layout-collapse',
    '../layers/layout-sidebar',
    '../layers/layout-topnav',
  ],

  runtimeConfig: {
    indexable: process.env.APP_INDEXABLE,
    public: {
      appEmailer: process.env.APP_EMAILER,
      siteUrl: process.env.APP_PUBLIC_URL,
      apiPath: isProduction
        ? ``
        : `${process.env.APP_PUBLIC_URL}:${process.env.APP_BACKEND_PORT}`,
      appWebSocketUrl: isProduction
        ? wsUrl
        : `${wsUrl}:${process.env.APP_BACKEND_PORT}`,
      siteName: process.env.APP_PUBLIC_SITE_NAME,
      titleSeparator: '|',
      siteDescription: process.env.APP_PUBLIC_SITE_DESCRIPTION,
      language: process.env.APP_DEFAULT_LANGUAGE,

      appBackendServerPort: process.env.APP_BACKEND_PORT,
      appActiveExchange: process.env.APP_ACTIVE_EXCHANGE,

      wCProjectId: process.env.APP_WALLET_CONNECT_PROJECT_ID,

      // paystackKey: process.env.APP_PAYSTACK_PUBLIC_KEY,
    },
  },

  ssr: false,

  css: ['~~/assets/css/main.css', '~~/assets/css/colors.css'],

  plugins: [
    '~~/plugins/lightbox.js',
    '~~/plugins/todays',
    '~~/plugins/permissions.ts',
    '~~/plugins/i18n.ts',
    '~~/plugins/dark-mode.client.ts',
    '~~/plugins/wagmi.ts',
    '~~/plugins/dotlottie.client.js',
    '~~/plugins/error-handler.js',
  ],

  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => ['dotlottie-player'].includes(tag),
    },
  },

  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/device',
    'nuxt-viewport',
    '@nuxtjs/critters',
    '@nuxtjs/partytown',
    '@nuxtjs/fontaine',
  ],

  viewport: {
    breakpoints: {
      xxs: 320,
      xs: 480,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },

    defaultBreakpoints: {
      mobile: 'xs',
      tablet: 'md',
      desktop: 'lg',
    },

    fallbackBreakpoint: 'lg',
  },

  pinia: {
    autoImports: ['defineStore'],
  },

  imports: {
    dirs: ['store'],
  },

  experimental: {
    watcher: 'chokidar-granular',
    writeEarlyHints: true,
    renderJsonPayloads: true,
  },

  routeRules: {
    ...appRules,
    ...landingRules,
  },

  render: {
    http2: {
      push: true,
      pushAssets: (req, res, publicPath, preloadFiles) =>
        preloadFiles
          .filter((f) => f.asType === 'script' && f.file === 'runtime.js')
          .map((f) => `<${publicPath}${f.file}>; rel=preload; as=${f.asType}`),
    },
    resourceHints: true,
  },

  vite: {
    define: {
      'process.test': false,
      // This is required for shiki to work (used to render markdown code blocks)
      'process.env.VSCODE_TEXTMATE_DEBUG': false,
    },
    build: {
      target: 'esnext',
      minify: isProduction ? 'terser' : false,
      chunkSizeWarningLimit: 1000,
    },
    server: {
      fs: {
        allow: ['..'],
      },
    },
    assetsInclude: [
      '**/*.lottie',
      '**/*.svg',
      '**/*.png',
      '**/*.jpg',
      '**/*.gif',
      '**/*.ico',
    ],
  },

  hooks: {
    'vite:extendConfig'(config, { isClient }) {
      if (config.define) {
        delete config.define.document
      }

      if (isProduction && isClient) {
        if (config.build?.rollupOptions?.output) {
          const outputConfig = config.build.rollupOptions.output
          if (Array.isArray(outputConfig)) {
            // If output is an array, apply changes to each object in the array
            outputConfig.forEach((output) => {
              output.entryFileNames = '_nuxt/e/[name]-[hash].js' // Change entry file name format
              output.chunkFileNames = '_nuxt/c/[name]-[hash].js' // Change chunk file name format
              output.assetFileNames = '_nuxt/a/[name]-[hash][extname]' // Change asset file name format
            })
          } else {
            // If output is not an array, apply changes directly
            outputConfig.entryFileNames = '_nuxt/e/[name]-[hash].js' // Change entry file name format
            outputConfig.chunkFileNames = '_nuxt/c/[name]-[hash].js' // Change chunk file name format
            outputConfig.assetFileNames = '_nuxt/a/[name]-[hash][extname]' // Change asset file name format
          }
        }
        config.build.chunkSizeWarningLimit = 1000
      }
    },
  },

  unfonts: {
    google: {
      families: ['Roboto Flex', 'Inter', 'Karla', 'Fira Code'],
    },
  },
})
