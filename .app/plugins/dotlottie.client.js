import { defineNuxtPlugin } from '#app'
import { DotLottiePlayer } from '@aarsteinmedia/dotlottie-player'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('DotLottiePlayer', DotLottiePlayer)
})
