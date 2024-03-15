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
    class="max-w-sm"
    aria-labelledby="sidebar-label"
    v-if="$viewport.isGreaterOrEquals('xl')"
  >
    <div class="w-full sticky top-6">
      <h3 id="sidebar-label" class="sr-only">Sidebar</h3>
      <div class="mb-12">
        <h4
          class="mb-4 text-sm font-bold text-gray-900 dark:text-white uppercase"
        >
          Latest news
        </h4>
        <div
          v-for="post in posts"
          :key="post.id"
          class="mb-6 flex items-center"
        >
          <a :href="`/blog/${post.slug}`" class="shrink-0">
            <img
              :src="post.image"
              class="mr-4 max-w-full w-24 h-24 rounded-lg"
              :alt="post.title"
            />
          </a>
          <div>
            <h5
              class="mb-2 text-lg font-bold leading-tight dark:text-white text-gray-900 marquee"
            >
              {{
                post.title.length > 20
                  ? post.title.slice(0, 20) + '...'
                  : post.title
              }}
            </h5>
            <p class="mb-2 text-gray-500 dark:text-gray-400 marquee">
              {{
                post.description.length > 50
                  ? post.description.slice(0, 50) + '...'
                  : post.description
              }}
            </p>
            <a
              :href="`/blog/${post.slug}`"
              class="inline-flex items-center font-medium underline underline-offset-4 text-primary-600 dark:text-primary-500 hover:no-underline"
            >
              Read more
            </a>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
