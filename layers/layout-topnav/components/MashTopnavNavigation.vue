<script setup lang="ts">
import { useTopnav } from '../composables/topnav'
import type { LayoutDisplay } from './MashTopnavLayout.vue'

const props = withDefaults(
  defineProps<{
    display: LayoutDisplay
    position: 'fixed' | 'absolute'
  }>(),
  {
    display: 'expanded-md',
    position: 'absolute',
  },
)
const { isMobileOpen } = useTopnav()
const app = useAppConfig()
</script>

<template>
  <div
    class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 left-0 top-0 z-40 w-full border-b bg-white transition-all duration-300"
    :class="[
      props.position === 'fixed' && 'fixed',
      props.position === 'absolute' && 'absolute',
    ]"
  >
    <nav
      class="relative"
      :class="[
        props.display === 'condensed' && 'w-full',
        props.display === 'horizontal-scroll' && 'mx-auto w-full pe-4',
        props.display === 'expanded-sm' &&
          'mx-auto w-full max-w-5xl px-4 lg:px-0',
        props.display === 'expanded-md' &&
          'mx-auto w-full max-w-6xl px-4 lg:px-0',
        props.display === 'expanded-lg' &&
          'mx-auto w-full max-w-7xl px-4 lg:px-0',
        props.display === 'expanded-xl' && 'mx-auto w-full px-4 lg:px-0',
      ]"
    >
      <div
        class="flex w-full flex-col items-center justify-between md:h-16 md:flex-row"
      >
        <div class="w-full grow md:w-auto">
          <slot></slot>
        </div>
        <div
          class="dark:bg-muted-800 fixed start-0 top-0 z-20 w-full grow items-center bg-white p-3 md:static md:z-0 md:block md:w-auto md:bg-transparent md:p-0"
          :class="isMobileOpen ? 'flex' : 'hidden'"
        >
          <div class="me-auto block md:hidden">
            <BaseButtonClose
              color="muted"
              shape="full"
              @click="isMobileOpen = false"
            />
          </div>
          <slot name="toolbar">
            <BaseButton to="#" color="primary">Get Started</BaseButton>
          </slot>
        </div>
      </div>
    </nav>
  </div>
</template>
