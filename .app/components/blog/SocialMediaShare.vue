<script lang="ts" setup>
const props = defineProps({
  post: {
    type: Object as PropType<Post>,
    required: true,
  },
})

const { toast } = useUtils()

const share = (type: string) => {
  const url = window.location.href
  const title = props.post?.title
  const description = props.post?.description
  const image = props.post?.image
  const twitterHandle = 'flowbite'
  const encodedUrl = encodeURIComponent(url)
  const twitterURL = `https://twitter.com/intent/tweet?text=${title}&url=${url}&via=${twitterHandle}`
  const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  const redditURL = `https://reddit.com/submit?url=${url}&title=${title}`
  const linkedinURL = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${description}&source=${url}`
  const emailURL = `mailto:?subject=${title}&body=${description} ${url}`
  const whatsappURL = `https://wa.me/?text=${title} ${url}`
  const telegramURL = `https://t.me/share/url?url=${url}&text=${title}`
  const pinterestURL = `https://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${title}`

  const shareURL = {
    twitter: twitterURL,
    facebook: facebookURL,
    reddit: redditURL,
    linkedin: linkedinURL,
    email: emailURL,
    whatsapp: whatsappURL,
    telegram: telegramURL,
    pinterest: pinterestURL,
    copy: url, // no change needed here
  }

  if (type === 'copy') {
    // Use Clipboard API to copy the URL
    navigator.clipboard
      .writeText(shareURL[type])
      .then(() => {
        toast.successText('Link copied to clipboard')
      })
      .catch((err) => {
        toast.dangerText('Failed to copy link to clipboard')
      })
  } else {
    window.open(shareURL[type], '_blank')
  }
}
</script>

<template>
  <aside aria-label="Share social media">
    <div class="not-format">
      <button
        @click="share('facebook')"
        data-nui-tooltip="Share on Facebook"
        class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        type="button"
      >
        <Icon
          name="bxl:facebook"
          class="w-5 h-5 text-gray-500 dark:text-gray-400"
        />
      </button>

      <button
        @click="share('twitter')"
        data-nui-tooltip="Share on Twitter"
        class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        type="button"
      >
        <Icon
          name="bxl:twitter"
          class="w-5 h-5 text-gray-500 dark:text-gray-400"
        />
      </button>

      <button
        @click="share('reddit')"
        data-nui-tooltip="Share on Reddit"
        class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        type="button"
      >
        <Icon
          name="bxl:reddit"
          class="w-5 h-5 text-gray-500 dark:text-gray-400"
        />
      </button>
      <button
        @click="share('copy')"
        data-nui-tooltip="Copy link to clipboard"
        class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        type="button"
      >
        <Icon
          name="bx:bx-copy"
          class="w-5 h-5 text-gray-500 dark:text-gray-400"
        />
      </button>
    </div>
  </aside>
</template>
