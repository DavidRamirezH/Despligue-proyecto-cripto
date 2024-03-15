<script lang="ts" setup>
const props = defineProps<{
  filter?: string
}>()
</script>

<template>
  <BasePlaceholderPage
    :title="filter && filter !== '' ? 'No matching results' : 'No results'"
    :subtitle="
      filter && filter !== ''
        ? 'Looks like we couldn\'t find any matching results for your search terms. Try other search terms.'
        : 'Looks like we don\'t have any data here yet.'
    "
  >
    <template #image>
      <img
        class="block dark:hidden"
        src="/img/illustrations/placeholders/flat/placeholder-search-6.svg"
        alt="Placeholder image"
      />
      <img
        class="hidden dark:block"
        src="/img/illustrations/placeholders/flat/placeholder-search-6-dark.svg"
        alt="Placeholder image"
      />
    </template>
  </BasePlaceholderPage>
</template>
