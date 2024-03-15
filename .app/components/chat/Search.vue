<script lang="ts" setup>
const props = defineProps<{
  chat: any
  element: any
  submitting: boolean
  isSupport: boolean
}>()

const search = ref('')
const searchIndex = ref(0)
const searchResults = ref([])

function searchMessages() {
  const term = search.value?.trim().toLowerCase()
  if (term) {
    searchResults.value = []
    searchIndex.value = 0
    const messages = props.chat?.messages || []
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i]
      if (message.text && message.text.toLowerCase().includes(term)) {
        searchResults.value.push(i)
      } else if (message.attachments) {
        for (let j = 0; j < message.attachments.length; j++) {
          const attachment = message.attachments[j]
          if (
            attachment.type === 'file' &&
            attachment.name.toLowerCase().includes(term)
          ) {
            searchResults.value.push(i)
            break
          }
        }
      }
    }

    if (searchResults.value.length > 0) {
      navigateToSearchResult(searchResults.value[0])
    }
  }
}

function navigateToSearchResult(index: number) {
  const messageElements = Array.from(props.element?.children || [])
  const messageElement = messageElements.find(
    (el) => el.getAttribute('data-index') === String(index),
  )
  if (messageElement) {
    messageElement.scrollIntoView({ behavior: 'smooth' })
  }
}

function nextResult() {
  if (searchResults.value.length > 0) {
    searchIndex.value = (searchIndex.value + 1) % searchResults.value.length
    navigateToSearchResult(searchResults.value[searchIndex.value])
  }
}

function previousResult() {
  if (searchResults.value.length > 0) {
    searchIndex.value =
      (searchIndex.value - 1 + searchResults.value.length) %
      searchResults.value.length
    navigateToSearchResult(searchResults.value[searchIndex.value])
  }
}

function onEnterPress() {
  if (searchResults.value.length > 0) {
    nextResult()
  } else {
    searchMessages()
  }
}

watch(
  () => props.submitting,
  () => {
    searchResults.value = []
    searchIndex.value = 0
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex items-center gap-2">
    <NuxtLink
      v-if="$viewport.isLessThan('sm')"
      :to="isSupport ? '/admin/support' : '/user/support'"
      data-nui-tooltip="Back"
      data-nui-tooltip-position="right"
      class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300"
    >
      <Icon name="lucide:arrow-left" class="h-5 w-5" />
    </NuxtLink>
    <BaseInput
      v-model="search"
      shape="curved"
      icon="lucide:search"
      placeholder="Search"
      @change="searchMessages"
      @keyup.enter="onEnterPress"
    />

    <BaseButtonIcon
      v-if="searchResults.length > 0"
      class="hidden sm:block"
      shape="curved"
      @click="previousResult"
    >
      <Icon name="lucide:arrow-left" class="h-5 w-5" />
    </BaseButtonIcon>
    <BaseButtonIcon
      v-if="searchResults.length > 0"
      class="hidden sm:block"
      shape="curved"
      @click="nextResult"
    >
      <Icon name="lucide:arrow-right" class="h-5 w-5" />
    </BaseButtonIcon>
  </div>
</template>
