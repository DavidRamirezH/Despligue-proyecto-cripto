<script setup lang="ts">
definePageMeta({
  permissions: ['Access Knowledge Base Management'],
  title: 'FAQ Management',
})

const { getAdminFaqAnalytics } = useFaq()
const analytics = ref<any>({})

async function fetchMetrics() {
  const response = (await getAdminFaqAnalytics()) as any
  if (response.status) {
    analytics.value = response.data
  }
}

onMounted(async () => {
  await fetchMetrics()
})
</script>

<template>
  <div class="space-y-5">
    <div
      class="grid gap-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
    >
      <div
        class="relative"
        v-for="(item, index) in analytics.metrics"
        :key="index"
      >
        <BaseCard class="space-y-1 p-5">
          <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
            {{ item.metric }}
          </BaseParagraph>
          <BaseHeading
            size="lg"
            weight="semibold"
            class="text-muted-800 dark:text-white"
          >
            <span>{{ item.value }}</span>
          </BaseHeading>
        </BaseCard>
      </div>
    </div>
    <div class="flex items-center justify-center mt-10">
      <MashLottie
        category="problems"
        url="find-solution"
        max="2"
        class="max-w-lg"
      />
    </div>
  </div>
</template>
