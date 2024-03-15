<script setup lang="ts">
import { useSidebar } from '../composables/sidebar'

const props = withDefaults(
  defineProps<{
    sidebar?: boolean
    horizontalScroll?: boolean
  }>(),
  {
    sidebar: true,
  },
)

const app = useAppConfig()
const { hasSubsidebar } = useSidebar()

const route = useRoute()

const showNavBurger = computed(() => {
  return (
    props.sidebar &&
    app.mash.sidebar?.toolbar?.showNavBurger &&
    hasSubsidebar.value
  )
})
</script>

<template>
  <div
    class="relative z-50 mb-5 flex h-16 items-center gap-2"
    id="toolbar"
    :class="props.horizontalScroll && 'pe-4 xl:pe-10'"
  >
    <MashSidebarBurger v-if="showNavBurger" class="-ms-3" />

    <BaseHeading
      v-if="app.mash.sidebar?.toolbar?.showTitle"
      as="h1"
      size="2xl"
      weight="light"
      class="text-muted-800 hidden md:block dark:text-white"
    >
      <slot name="title">{{ route.meta.title }}</slot>
    </BaseHeading>

    <div class="ms-auto"></div>
    <MashSidebarTools class="h-16" />
  </div>
</template>
