<script setup lang="ts">
import 'assets/css/typography.css'
definePageMeta({
  title: 'Blog',
})

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string

const blogStore = useBlogStore()
const post = ref(null)
const userStore = useUserStore()

onMounted(async () => {
  if (userStore.isLoggedIn) {
    setPageLayout('default')
  }
  if (blogStore.posts.length === 0) {
    await blogStore.fetchPosts()
  }
  post.value = blogStore.posts.find((p) => p.slug === slug)
})

const formattedDate = computed(() => {
  return new Date(post.value?.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const newestPosts = computed(() => {
  return [...blogStore.posts]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 3)
})

// Computed property for related posts
const relatedPosts = computed(() => {
  return blogStore.posts.filter(
    (p) => p.category_id === post.value?.category_id && p.id !== post.value?.id,
  )
})
</script>

<template>
  <template v-if="post">
    <div class="pb-24">
      <main class="pb-16 lg:pb-24 antialiased mb-20">
        <header
          class="w-full h-[460px] xl:h-[537px] bg-no-repeat bg-cover bg-center bg-blend-darken relative"
          :style="{
            backgroundImage: `url(${
              post.image || '/img/illustrations/dashboards/writer/post-1.svg'
            })`,
          }"
        >
          <div
            class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"
          ></div>
          <div
            class="absolute top-20 left-1/2 px-4 mx-auto w-full -translate-x-1/2 xl:top-1/2 xl:-translate-y-1/2 mx-12 pb-5"
          >
            <h1
              class="mb-4 max-w-4xl text-2xl font-extrabold leading-none text-white sm:text-3xl lg:text-4xl"
            >
              {{ post?.title }}
            </h1>
            <p class="text-lg font-normal text-gray-300 max-w-4xl">
              {{ post?.description }}
            </p>
          </div>
        </header>
        <BaseCard
          class="flex relative z-20 justify-between p-6 -my-36 bg-white dark:bg-gray-800 xl:p-9 gap-5"
          shape="curved"
        >
          <article
            class="w-full lg:max-w-3xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert"
          >
            <div
              class="flex flex-col lg:flex-row justify-between lg:items-center"
            >
              <div
                class="flex items-center space-x-3 text-gray-500 dark:text-gray-400 text-base mb-2 lg:mb-0"
              >
                <BaseButton
                  @click="router.back()"
                  shape="rounded"
                  color="muted"
                  size="sm"
                  flavor="outline"
                >
                  <Icon name="lucide:arrow-left" />
                </BaseButton>
                <span
                  >By
                  <a
                    href="#"
                    class="text-gray-900 dark:text-white hover:underline no-underline font-semibold"
                    >{{ post?.author.user.first_name }}
                    {{ post?.author.user.last_name }}</a
                  ></span
                >
                <span
                  class="bg-gray-300 dark:bg-gray-400 w-2 h-2 rounded-full"
                ></span>
                <span
                  ><p
                    class="font-normal text-gray-500 dark:text-gray-400 uppercase"
                  >
                    {{ formattedDate }}
                  </p></span
                >
              </div>
              <BlogSocialMediaShare :post="post" />
            </div>
            <div v-html="post?.content"></div>
          </article>
          <BlogPostSidebar :posts="newestPosts" />
        </BaseCard>
      </main>

      <BlogRelatedArticles :posts="relatedPosts" />
    </div>
  </template>

  <template v-else>
    <BasePlaceholderPage
      title="Post not found"
      subtitle="Looks like the post you're looking for doesn't exist."
      class="h-[calc(100vh_-_200px)]"
    >
      <template #image>
        <img
          src="/img/illustrations/magician.svg"
          class="slow-bounce"
          alt="Placeholder image"
        />
      </template>
      <BaseButton
        @click="router.back()"
        shape="rounded"
        color="primary"
        flavor="outline"
        class="mt-8"
      >
        <Icon name="lucide:arrow-left" />
        <span>{{ $t('Back') }}</span>
      </BaseButton>
    </BasePlaceholderPage>
  </template>
</template>
