<script lang="ts" setup>
const props = defineProps<{
  isSupport: boolean
}>()
</script>

<template>
  <div
    class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative z-10 hidden h-screen w-20 border-r bg-white sm:block"
  >
    <div class="flex h-full flex-col justify-between">
      <div class="flex flex-col">
        <div
          class="ltablet:w-full flex h-16 w-16 shrink-0 items-center justify-center lg:w-full"
        >
          <NuxtLink to="/" class="flex items-center justify-center">
            <Logo class="text-primary-600 h-10" />
          </NuxtLink>
        </div>
        <div
          class="ltablet:w-full flex h-16 w-16 shrink-0 items-center justify-center lg:w-full"
        >
          <NuxtLink
            :to="isSupport ? '/admin/support' : '/user/support'"
            data-nui-tooltip="Back"
            data-nui-tooltip-position="right"
            class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300"
          >
            <Icon name="lucide:arrow-left" class="h-5 w-5" />
          </NuxtLink>
        </div>
      </div>
      <div class="flex flex-col">
        <div class="flex h-16 w-full items-center justify-center">
          <AccountMenu />
        </div>
      </div>
    </div>
  </div>
</template>
