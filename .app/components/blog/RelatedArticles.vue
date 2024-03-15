<script lang="ts" setup>
import type { Post } from '~~/types'

const props = defineProps({
  posts: {
    type: Array as PropType<Post[]>,
    required: true,
  },
})
</script>

<template>
  <aside
    aria-label="Related articles"
    class="py-8 lg:py-24"
    v-if="posts.length > 0"
  >
    <div class="px-4 mx-auto max-w-screen-xl">
      <h2 class="mb-6 lg:mb-8 text-2xl font-bold text-gray-900 dark:text-white">
        Related articles
      </h2>
      <div
        class="grid gap-6 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        <!-- Loop through related posts -->
        <article
          v-for="post in posts"
          :key="post.id"
          class="flex flex-col gap-5"
        >
          <a :href="`/blog/${post.slug}`" class="mb-2 xl:mb-0">
            <img :src="post.image" class="mr-5 max-w-sm" :alt="post.title" />
          </a>
          <div class="flex flex-col justify-center">
            <h2
              class="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white"
            >
              <a :href="`/blog/${post.slug}`">{{ post.title }}</a>
            </h2>
            <p class="mb-4 text-gray-500 dark:text-gray-400 max-w-sm">
              {{ post.description }}
            </p>
            <a
              :href="`/blog/${post.slug}`"
              class="inline-flex items-center font-medium underline underline-offset-4 text-primary-600 dark:text-primary-500 hover:no-underline"
            >
              Read more
            </a>
          </div>
        </article>
      </div>
    </div>
  </aside>
</template>
