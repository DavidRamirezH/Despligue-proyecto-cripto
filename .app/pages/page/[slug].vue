<script setup lang="ts">
definePageMeta({
  layout: 'nav',
  title: 'Page',
})
const route = useRoute()
const slug = route.params.slug as string

const pageStore = usePageStore()
const page = ref(null)

onMounted(async () => {
  if (pageStore.pages.length === 0) {
    await pageStore.fetchPages() // Fetch pages if not already loaded
  }
  page.value = pageStore.pages.find((p) => p.slug === slug)
})
</script>

<template>
  <div class="pt-20">
    <MashContentWrapper>
      <div class="relative w-full pb-20 px-2 lg:px-4 overflow-hidden">
        <div
          class="w-full max-w-7xl mx-auto pt-6 sm:pt-10"
          :class="{
            'grid grid-cols-12 md:gap-x-10 gap-y-10': page?.image,
            'flex justify-center items-center': !page?.image,
          }"
        >
          <!-- Featured image -->
          <div
            class="col-span-12 ltablet:col-span-5 ltablet:col-start-2 lg:col-span-5"
            v-if="page?.image"
          >
            <img
              :src="page?.image"
              alt="featured image"
              class="block max-w-full w-full md:w-[540px] md:h-[447px] ltablet:w-[459px] ltablet:h-[380px] object-cover rounded-2xl mx-auto"
            />
          </div>
          <!-- page Details -->
          <div
            :class="{
              'col-span-12 ltablet:col-span-5 lg:col-span-5 ltablet:col-start-7 lg:col-start-7':
                page?.image,
            }"
          >
            <div class="h-full flex items-center">
              <div class="w-full max-w-md ptablet:mx-auto">
                <!-- Title -->
                <h1
                  class="font-sans text-muted-800 dark:text-white font-bold text-3xl"
                >
                  {{ page?.title }}
                </h1>
                <p
                  class="font-sans text-sm text-muted-500 dark:text-muted-400 my-4"
                >
                  {{ page?.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section class="px-16 py-10 bg-white dark:bg-muted-800 -mx-16">
        <div class="max-w-2xl mx-auto">
          <div class="post-body" v-html="page?.content"></div>
        </div>
      </section>
    </MashContentWrapper>
  </div>
</template>
