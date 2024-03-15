<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Pagination, Slide } from 'vue3-carousel'
import type { User } from '~~/types'

definePageMeta({
  title: 'Blog',
})

const route = useRoute()

const userStore = useUserStore()
const user = computed<User | null>(() => userStore.getProfile)
const blogStore = useBlogStore()
const posts = computed(() => blogStore.posts ?? [])

onMounted(async () => {
  if (userStore.isLoggedIn) {
    setPageLayout('default')
  }
  if (blogStore.posts.length === 0) {
    await blogStore.fetchPosts()
  }
  if (blogStore.categories.length === 0) {
    await blogStore.fetchCategories()
  }
  if (blogStore.tags.length === 0) {
    await blogStore.fetchTags()
  }
})

// Pagination Constants
const filter = ref('')
const perPage = ref(12)
const page = computed(() => parseInt((route.query.page as string) ?? '1'))

// Filter
const items = computed(() => {
  if (posts.value && Array.isArray(posts.value)) {
    return posts.value.filter(
      (item) => item.title?.toLowerCase().includes(filter.value.toLowerCase()),
    )
  } else {
    return []
  }
})

// Pagination
const paginatedItems = computed(() => {
  const start = (page.value - 1) * perPage.value
  const end = start + perPage.value
  return items.value.slice(start, end)
})

const latestPosts = computed(() => {
  return [...posts.value]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 3)
})

const categories = computed(() => blogStore.categories ?? [])
const tags = computed(() => blogStore.tags ?? [])
</script>

<template>
  <div
    :class="{
      'p-10 pt-20': !user,
    }"
  >
    <Carousel>
      <Slide
        v-for="post in latestPosts"
        :key="post.id"
        v-if="latestPosts.length > 0"
      >
        <div
          class="w-full bg-no-repeat bg-cover bg-center relative h-[460px] xl:h-[537px] rounded-lg flex items-center justify-center"
          :style="{
            backgroundImage: `url(${
              post.image || '/img/illustrations/dashboards/writer/post-1.svg'
            })`,
          }"
        >
          <!-- Overlay with a semi-transparent black background -->
          <div class="absolute inset-0 bg-black bg-opacity-50"></div>
          <div class="text-center z-10">
            <NuxtLink :to="`/blog/${post.slug}`" class="hover:underline"
              ><h1 class="text-4xl font-bold text-white">
                {{ post.title }}
              </h1></NuxtLink
            >
            <p class="mt-2 text-lg text-white">{{ post.description }}</p>
          </div>
        </div>
      </Slide>

      <template #addons>
        <Pagination />
      </template>
    </Carousel>
    <MashContentWrapper
      class="pt-10 mt-10 border-t border-muted-200 dark:border-muted-700/60"
    >
      <template #left>
        <div>
          <BaseHeading
            tag="h1"
            size="lg"
            weight="bold"
            class="text-gray-800 dark:text-gray-100"
          >
            {{ $t('Latest Posts') }}
          </BaseHeading>
          <p class="text-muted-400 font-sans text-lg">
            {{
              $t(
                'Explore through our latest posts to find the content that interests you the most',
              )
            }}.
          </p>
        </div>
      </template>
      <template #right>
        <BaseInput
          v-model="filter"
          icon="lucide:search"
          shape="curved"
          placeholder="Search posts..."
          :classes="{
            wrapper: 'w-full sm:w-auto',
          }"
        />
      </template>
      <div>
        <NoResult
          v-if="
            (filter !== '' && paginatedItems?.length === 0) ||
            paginatedItems?.length === 0
          "
          :filter="filter"
        />
        <div
          v-else
          class="grid w-full gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <TransitionGroup
            enter-active-class="transform-gpu"
            enter-from-class="opacity-0 -translate-x-full"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="absolute transform-gpu"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-full"
          >
            <BlogPostCard
              v-for="item in posts"
              :key="item.id"
              :item="item"
              :user="user"
              :categoryName="item.category.name"
            />
          </TransitionGroup>
        </div>
        <div class="mt-6">
          <BasePagination
            v-if="posts?.length > perPage"
            :total-items="posts?.length ?? 0"
            :item-per-page="perPage"
            :current-page="page"
            shape="curved"
          />
        </div>
      </div>
    </MashContentWrapper>

    <MashContentWrapper
      class="py-10 mt-10 border-t border-muted-200 dark:border-muted-700/60"
    >
      <template #left>
        <div>
          <BaseHeading
            tag="h1"
            size="lg"
            weight="bold"
            class="text-gray-800 dark:text-gray-100"
          >
            {{ $t('Explore Our Categories') }}
          </BaseHeading>
          <p class="text-muted-400 font-sans text-lg">
            {{
              $t(
                'Browse through our diverse collection of categories to find the content that interests you the most',
              )
            }}.
          </p>
        </div>
      </template>
      <div
        class="grid w-full gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/blog/categories/${category.slug}`"
        >
          <BaseCard
            shape="curved"
            class="group p-3 transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <div class="relative">
              <img
                :src="
                  category.image
                    ? category.image
                    : '/img/illustrations/dashboards/writer/post-2.svg'
                "
                class="h-60 w-full rounded-lg object-cover"
              />
              <div
                class="absolute top-0 left-0 h-60 w-full bg-black opacity-0 group-hover:opacity-50 transition-all duration-300"
              ></div>
            </div>
            <div class="mt-3">
              <BaseHeading
                tag="h3"
                size="md"
                weight="medium"
                lead="snug"
                class="line-clamp-2 text-gray-800 dark:text-gray-100"
              >
                {{ category.name }}
              </BaseHeading>
              <p class="text-muted-400 font-sans text-xs">
                {{ category.description }}
              </p>
            </div>
          </BaseCard>
        </NuxtLink>
      </div>

      <div
        class="py-10 mt-10 border-t border-muted-200 dark:border-muted-700/60"
      >
        <div class="mb-6">
          <BaseHeading
            tag="h1"
            size="lg"
            weight="bold"
            class="text-gray-800 dark:text-gray-100"
          >
            {{ $t('Explore Tags') }}
          </BaseHeading>
          <p class="text-muted-400 font-sans text-lg">
            {{
              $t(
                'Browse through our tags to find content that matches your interests',
              )
            }}.
          </p>
        </div>
        <div class="flex gap-2">
          <NuxtLink
            v-for="tag in tags"
            :key="tag.id"
            :to="`/blog/tags/${tag.slug}`"
          >
            <BaseTag shape="rounded" color="muted">{{ tag.name }}</BaseTag>
          </NuxtLink>
        </div>
      </div>
    </MashContentWrapper>
  </div>
</template>

<style lang="pcss" scoped>
.carousel__slide {
  @apply p-2;
}

.carousel__item {
  /* Your existing classes */
  @apply w-full bg-no-repeat bg-cover bg-center relative h-[460px] xl:h-[537px] rounded-lg flex items-center justify-center;

  /* Set the position relative for pseudo-element positioning */
  position: relative;
  overflow: hidden; /* Ensure the animation is contained within the borders */
}

.carousel__item::before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: inherit; /* Use the same image as the .carousel__item */
  background-size: cover;
  background-position: center;
  z-index: -1; /* Place it behind the content */

  animation:
    panAndZoom 15s ease-in-out infinite alternate,
    fadeInOut 10s ease-in-out infinite 5s,
    blurToFocus 20s ease-in-out infinite 10s;
}

@keyframes panAndZoom {
  0%,
  100% {
    transform: scale(1) translateX(0);
  }
  50% {
    transform: scale(1.1) translateX(-10%);
  }
}

@keyframes fadeInOut {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@keyframes blurToFocus {
  0%,
  100% {
    filter: blur(0px);
  }
  50% {
    filter: blur(4px);
  }
}

.overlay {
  @apply absolute inset-0 bg-black bg-opacity-50;
}

.content {
  @apply z-10;
}

:deep(.carousel__next--in-active),
:deep(.carousel__prev--in-active) {
  @apply opacity-70;
}

:deep(.carousel__next) {
  @apply end-0;
}

:deep(.carousel__next) svg {
  @apply -end-px;
}

:deep(.carousel__prev) {
  @apply end-8;
}

:deep(.carousel__prev) svg {
  @apply -start-px;
}

:deep(.carousel__next),
:deep(.carousel__prev) {
  @apply absolute -top-5 text-muted-400 transition-colors duration-300;
  left: initial;
}

:deep(.carousel__next) svg,
:deep(.carousel__prev) svg {
  @appy relative w-3 h-3;
}

:deep(.carousel__next:hover),
:deep(.carousel__prev:hover) {
  @apply text-primary-500;
}
</style>
