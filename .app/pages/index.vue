<script setup lang="ts">
definePageMeta({
  layout: 'frontend',
})
const frontendStore = useFrontendStore()
const sectionsMap = ref<Record<string, any>>({})
const settingsStore = useSettingsStore()
const settings = computed(() => settingsStore.settings)
const frontendType = computed(() => settings.value?.frontend_type ?? 'Basic')
const customHtml = ref('')
const userStore = useUserStore()
const user = computed(() => userStore.getProfile)
const router = useRouter()
const customContentContainer = ref<HTMLElement | null>(null)
const config = useRuntimeConfig()
const wsUrl = config.public.appWebSocketUrl
const apiUrl = config.public.apiPath
const shouldTeleportMarketAnalysis = ref(false)

const { getFrontendHtml } = useFrontend()

onMounted(async () => {
  if (frontendType.value === 'Basic') {
    if (frontendStore.sections.length === 0) {
      await frontendStore.fetchSections()
    }
    frontendStore.sections.forEach((section: any) => {
      sectionsMap.value[section.section] = section
    })
  } else {
    const path = `/theme/projects/template/index.html`
    if (path) {
      try {
        const response = await getFrontendHtml(path)
        const htmlContent = await response.data

        // Parse the HTML content
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlContent, 'text/html')
        const basePath = path.substring(0, path.lastIndexOf('/') + 1)

        // Process and update HTML content
        const cssFilesToSkip = [
          'css/bootstrap.css',
          'css/mash.css',
          'css/style.css',
        ]
        removeUnneededCssLinks(doc, cssFilesToSkip)
        addStylesMinCss(doc, basePath)
        updateLinksAndSources(doc, basePath)
        updateStyleUrls(doc, basePath)

        doc
          .querySelectorAll('img')
          .forEach((img) => img.setAttribute('loading', 'lazy'))
        customHtml.value = doc.documentElement.outerHTML

        await nextTick()

        // Handle jQuery and script loading
        await handlejQueryAndScripts(doc, basePath)
      } catch (error) {
        console.error('Error fetching and processing HTML content:', error)
      }
    }

    await nextTick()

    const marketsOverviewContainer = document.getElementById(
      'markets-overview-container',
    )
    if (marketsOverviewContainer) {
      shouldTeleportMarketAnalysis.value = true
    }

    const containerElement = document.getElementById('frontend')
    if (containerElement) {
      replaceElementsWithRouterLinks(containerElement, router)
    }
  }
})

function removeUnneededCssLinks(doc, cssFilesToSkip) {
  doc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    if (cssFilesToSkip.includes(link.getAttribute('href'))) {
      link.remove()
    }
  })
}

function addStylesMinCss(doc, basePath) {
  const newCssLink = doc.createElement('link')
  newCssLink.setAttribute('rel', 'stylesheet')
  newCssLink.setAttribute('href', basePath + 'css/styles.min.css')
  doc.head.appendChild(newCssLink)
}

function updateLinksAndSources(doc, basePath) {
  const directories = [
    'images',
    'fonts',
    'video',
    'css',
    'js',
    'bat',
    'mash',
    'audio',
  ]
  const selector = directories
    .map(
      (dir) =>
        `[src^="${dir}/"], [href^="${dir}/"], [data-slide-bg^="${dir}/"]`,
    )
    .join(', ')
  doc.querySelectorAll(selector).forEach((el) => {
    ;['src', 'href', 'data-slide-bg'].forEach((attr) => {
      if (el.hasAttribute(attr)) {
        el.setAttribute(attr, basePath + el.getAttribute(attr))
      }
    })
  })
}

function updateStyleUrls(doc, baseUrl) {
  doc.querySelectorAll('[style]').forEach((el) => {
    let style = el.style.cssText
    if (style) {
      style = style.replace(/url\(['"]?(.*?)['"]?\)/g, (match, url) => {
        if (
          !url.startsWith('http://') &&
          !url.startsWith('https://') &&
          !url.startsWith('//')
        ) {
          return `url(${baseUrl}${url})`
        }
        return match
      })
      el.style.cssText = style
    }
  })
}

async function handlejQueryAndScripts(doc, basePath) {
  const jQueryScript = doc.querySelector('script[src*="jquery"]')
  jQueryScript?.parentNode?.removeChild(jQueryScript)
  if (jQueryScript) {
    await loadjQueryAndMigrate()
  }
  await loadRequiredScripts(doc, basePath)
}

async function loadjQueryAndMigrate() {
  try {
    const jQueryModule = await import('jquery')
    window.$ = window.jQuery = jQueryModule.default
    await import('jquery-migrate')
    jQuery.migrateMute = true
  } catch (error) {
    console.error('Error loading jQuery: ', error)
  }
}

async function loadRequiredScripts(doc, basePath) {
  const requiredScripts = modulesMapping(doc)
  for (const scriptPath of requiredScripts) {
    try {
      await loadScript(basePath + scriptPath)
    } catch (error) {
      console.error(`Error loading script for module ${scriptPath}: `, error)
    }
  }
}

function modulesMapping(doc) {
  const isIE = /MSIE \d|Trident.*rv:/.test(navigator.userAgent)

  const scriptConfig = [
    { selector: null, script: isIE ? 'js/pointer-events.min.js' : null },
    { selector: null, script: 'js/touchSwipe.js' },
    { selector: null, script: 'js/bootstrap.js' },
    {
      selector: '[data-custom-scroll-to]',
      script: 'js/custom-waypoints.js',
    },
    { selector: null, script: 'js/device.js' },
    { selector: null, script: 'js/html5shiv.min.js' },
    { selector: null, script: 'js/inheritance.js' },
    { selector: '.isotope', script: 'js/isotope.js' },
    { selector: '.jp-jplayer', script: 'js/jplayer.js' },
    {
      selector: '.recaptcha',
      script:
        '//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en',
    },
    {
      selector: '.progress-bar-circle',
      script: 'js/jquery-circle-progress.js',
    },
    { selector: '.counter', script: 'js/jquery.countTo.js' },
    { selector: '.countdown', script: 'js/jquery.countdown.js' },
    { selector: null, script: 'js/jquery-resize-module.js' },
    { selector: null, script: 'js/js-cookie.js' },
    { selector: null, script: 'js/lettering.js' },
    { selector: null, script: 'js/lightgallery.js' },
    { selector: '.owl-carousel', script: 'js/owl.js' },
    { selector: '#blog-posts-container', script: 'js/owl.js' },
    { selector: '#blog-posts-container', script: 'js/blog-posts.js' },
    { selector: '.parallax-container', script: 'js/material-parallax.js' },
    { selector: '#particles-js', script: 'js/particles.js' },
    { selector: null, script: 'js/popperjs.js' },
    { selector: '.facebook', script: 'js/rd-facebook-feed.js' },
    { selector: '.flickr', script: 'js/rd-flickr.js' },
    { selector: '.google-map-container', script: 'js/rd-google-map.js' },
    { selector: '.instafeed', script: 'js/rd-instafeed.js' },
    { selector: '.rd-mailform', script: 'js/rd-mailform.js' },
    { selector: '.rd-navbar', script: 'js/rd-navbar.js' },
    {
      selector: '.twitter',
      script: 'js/rd-twitter-feed.js',
    },
    { selector: '.vide_bg', script: 'js/rd-video.js' },
    { selector: null, script: 'js/select2.js' },
    { selector: "input[type='number']", script: 'js/stepper.js' },
    {
      selector: '[data-circle-countdown]',
      script: 'js/svg-progress-circle.js',
    },
    { selector: '.swiper-container', script: 'js/swiper.js' },
    { selector: null, script: 'js/tether.js' },
    { selector: '.textillate', script: 'js/textillate.js' },
    { selector: '.typed-text-wrap', script: 'js/typed.js' },
    { selector: null, script: 'js/uitotop.js' },
    { selector: '.vide_bg', script: 'js/vide.js' },
    { selector: '.wow', script: 'js/wow.js' },
    { selector: null, script: 'js/script.js' },
  ]

  return scriptConfig
    .filter(({ selector, script }) => !selector || doc.querySelector(selector))
    .map(({ script }) => script)
    .filter((script) => script !== null)
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Function to create and append script element
    const appendScript = (scriptSrc) => {
      const script = document.createElement('script')
      script.async = true
      script.src = scriptSrc

      script.onload = () => resolve(script)
      script.onerror = () =>
        reject(new Error(`Script load error for ${scriptSrc}`))

      document.head.appendChild(script)
    }

    if (src) {
      if (src.includes('blog-posts.js')) {
        loadCSS('/css/owl.css')
        fetch(src)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Network response was not ok for script: ${src}`)
            }
            return response.text()
          })
          .then((scriptContent) => {
            scriptContent = replaceApiAndWebSocketUrls(scriptContent)
            const blob = new Blob([scriptContent], { type: 'text/javascript' })
            const modifiedSrc = URL.createObjectURL(blob)

            appendScript(modifiedSrc)
            URL.revokeObjectURL(modifiedSrc) // Clean up blob URL after appending
          })
          .catch((error) => {
            reject(error)
          })
      } else {
        // Directly append script for other sources
        const finalSrc = replaceApiAndWebSocketUrls(src)
        appendScript(finalSrc)
      }
    } else {
      resolve()
    }
  })
}

function loadCSS(href) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

function replaceElementsWithRouterLinks(container, router) {
  const clickableElements = container.querySelectorAll('a, .nuxt-link-button')

  clickableElements.forEach((element) => {
    const href =
      element.tagName === 'A'
        ? element.getAttribute('href')
        : element.getAttribute('data-nuxt-link')
    if (href && !href.startsWith('http') && !href.startsWith('//')) {
      element.addEventListener('click', (event) => {
        event.preventDefault()
        router.push(href)
      })
    }
  })
}

function replaceApiAndWebSocketUrls(scriptContent) {
  return scriptContent
    .replace(/ws:\/\/localhost:4000/g, wsUrl)
    .replace(/http:\/\/localhost:4000/g, apiUrl)
}

const isBannerVisible = computed(
  () => sectionsMap.value.banner?.status ?? false,
)
const isFeaturesVisible = computed(
  () => sectionsMap.value.features?.status ?? false,
)
const isMarketsVisible = computed(
  () => sectionsMap.value.markets?.status ?? false,
)
const isOnboardingVisible = computed(
  () => sectionsMap.value.steps?.status ?? false,
)
const isFooterVisible = computed(
  () => sectionsMap.value.footer?.status ?? false,
)
const isAnimatedBgVisible = computed(
  () => sectionsMap.value.animated_bg?.status ?? false,
)
const callToActionVisible = computed(
  () => sectionsMap.value.call_to_action?.status ?? false,
)
</script>

<template>
  <div class="relative" v-if="frontendType === 'Basic'">
    <div class="animated-bg w-full flex-col">
      <FrontendAnimatedBg v-if="isAnimatedBgVisible" />
      <FrontendBanner v-if="isBannerVisible" />
      <FrontendMarkets v-if="isMarketsVisible" />
      <FrontendFeatures v-if="isFeaturesVisible" />
      <FrontendOnboarding v-if="isOnboardingVisible" />
      <FrontendCallToAction v-if="callToActionVisible" />
      <FrontendFooter v-if="isFooterVisible" />
    </div>
  </div>
  <template v-else>
    <div>
      <div
        v-if="user?.role?.name === 'Super Admin'"
        class="absolute top-0 z-50 flex h-8 w-full items-center justify-between bg-[#1D2327] px-4 py-2 text-sm"
      >
        <!-- Left side content, e.g., site name or logo -->
        <div class="flex items-center justify-start gap-4">
          <div class="flex items-center justify-start gap-2">
            <Icon name="vaadin:dashboard" class="h-4 w-4" />
            <a href="/admin" class="text-white no-underline hover:underline">{{
              settings?.site_name
            }}</a>
          </div>
          <div class="flex items-center justify-start gap-2">
            <Icon name="dashicons:admin-appearance" class="h-4 w-4" />
            <a
              href="/admin/appearance"
              class="text-white no-underline hover:underline"
              >Appearance</a
            >
          </div>
        </div>

        <!-- Right side content, e.g., user info, logout button -->
        <div>
          <!-- You can use `user` variable here to show user info -->
          <span class="text-white"
            >Howdy,
            <NuxtLink to="/user/profile-edit">{{
              user?.first_name
            }}</NuxtLink></span
          >
        </div>
      </div>

      <div
        ref="customContentContainer"
        :class="{
          'xs-0 lg:mt-8': user?.role?.name === 'Super Admin',
        }"
        id="frontend"
        v-html="customHtml"
      ></div>
      <Teleport
        to="#markets-overview-container"
        v-if="shouldTeleportMarketAnalysis"
      >
        <MarketAnalysis :is-bootstrap="true" />
      </Teleport>
    </div>
  </template>
</template>
