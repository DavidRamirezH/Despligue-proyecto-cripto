<script setup lang="ts">
const props = defineProps<{
  error: any
}>()

const app = useAppConfig()
</script>

<template>
  <MashSidebarLayout :sidebar="false">
    <template #toolbar-title>{{ app.mash.title }}</template>

    <MashError :error="props.error" />
  </MashSidebarLayout>
</template>
