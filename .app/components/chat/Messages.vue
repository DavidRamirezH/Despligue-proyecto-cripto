<script lang="ts" setup>
const props = defineProps<{
  isSupport: boolean
  chat: any
  ticket: any
  imageSizes: any
}>()

const userStore = useUserStore()
const user = computed(() => userStore.getProfile)

const isSender = (message: {
  type: string
  user_id: number
  agent_id: number
}) => {
  if (props.isSupport) {
    const agentIsSender =
      message.agent_id &&
      ((message.agent_id === user.value?.id && message.type === 'agent') ||
        (message.agent_id !== user.value?.id && message.type === 'client'))
    return agentIsSender
  } else {
    const userIsSender =
      (message.user_id === user.value?.id && message.type === 'client') ||
      (message.user_id !== user.value?.id && message.type === 'agent')
    return userIsSender
  }
}

const currentImage = ref<string | null>(null)
const isLightboxOpen = ref<boolean>(false)

function openLightbox(image: string) {
  currentImage.value = image
  isLightboxOpen.value = true
}

function closeLightbox() {
  isLightboxOpen.value = false
}

const isSmallImage = (imageUrl: any) => {
  const size = props.imageSizes[imageUrl]
  return size && size.width <= 246 && size.height <= 246
}

function timeAgo(date: any) {
  const now = new Date()
  const secondsPast: any = (now.getTime() - date.getTime()) / 1000

  if (secondsPast < 60) {
    return `${parseInt(secondsPast)} ${
      parseInt(secondsPast) === 1 ? 'second' : 'seconds'
    }`
  }
  if (secondsPast < 3600) {
    return `${parseInt(secondsPast / 60)} ${
      parseInt(secondsPast / 60) === 1 ? 'minute' : 'minutes'
    }`
  }
  if (secondsPast <= 86400) {
    return `${parseInt(secondsPast / 3600)} ${
      parseInt(secondsPast / 3600) === 1 ? 'hour' : 'hours'
    }`
  }
  if (secondsPast > 86400 && secondsPast <= 604800) {
    return `${parseInt(secondsPast / 86400)} ${
      parseInt(secondsPast / 86400) === 1 ? 'day' : 'days'
    }`
  }
  if (secondsPast > 604800 && secondsPast <= 2592000) {
    return `${parseInt(secondsPast / 604800)} ${
      parseInt(secondsPast / 604800) === 1 ? 'week' : 'weeks'
    }`
  }
  if (secondsPast > 2592000) {
    return 'long time'
  }
}
</script>

<template>
  <div
    v-for="(item, index) in chat?.messages"
    :key="index"
    :data-index="index"
    class="relative flex w-full gap-4"
    :class="[
      isSender(item) ? 'flex-row-reverse' : 'flex-row',
      item.type === 'separator' ? 'justify-center' : '',
    ]"
  >
    <template v-if="item.type !== 'separator'">
      <div class="shrink-0">
        <BaseAvatar
          v-if="isSender(item)"
          :src="user?.avatar || '/img/avatars/1.svg'"
          size="xs"
        />
        <BaseAvatar
          v-else
          :src="ticket?.chat?.agent?.avatar || '/img/avatars/1.svg'"
          size="xs"
        />
      </div>
      <div class="flex max-w-md flex-col">
        <template v-if="item.attachments?.length > 0">
          <!-- For single image -->
          <div
            v-if="item.attachments.length === 1"
            :class="
              isSender(item)
                ? 'text-right rounded-se-none'
                : 'text-left rounded-ss-none'
            "
          >
            <div v-if="item.attachments[0].type === 'image'" class="max-w-xs">
              <div class="image-container">
                <img
                  loading="lazy"
                  :src="item.attachments[0].image"
                  :alt="item.attachments[0].text"
                  class="dark:bg-muted-800 rounded-2xl bg-white p-1"
                  @click="openLightbox(item.attachments[0].image)"
                />
                <div
                  class="overlay"
                  @click="openLightbox(item.attachments[0].image)"
                >
                  <Icon name="lucide:zoom-in" class="h-5 w-5 zoom-icon" />
                </div>
              </div>
            </div>
            <template v-else>
              <div
                v-if="item.text"
                class="bg-muted-200 dark:bg-muted-800 rounded-xl p-4 mb-2 text-left"
                :class="isSender(item) ? 'rounded-se-none' : 'rounded-ss-none'"
              >
                <p class="font-sans text-sm">{{ item.text }}</p>
              </div>

              <div>
                <NuxtLink
                  :to="item.attachments[0].url"
                  target="_blank"
                  class="flex text-left"
                  :class="isSender(item) ? 'justify-end' : 'justify-start'"
                >
                  <div
                    v-if="isSmallImage(item.attachments[0].image)"
                    class="flex max-w-sm rounded-2xl bg-white dark:bg-muted-800 p-2 overflow-hidden"
                    :class="
                      isSender(item) ? 'rounded-se-none ' : 'rounded-ss-none'
                    "
                  >
                    <div class="w-full rounded-xl overflow-hidden">
                      <img
                        loading="lazy"
                        :src="item.attachments[0].image"
                        :alt="item.attachments[0].title"
                        class="w-24 h-24 transform transition-all duration-300 hover:scale-105"
                      />
                    </div>
                    <div class="pl-2">
                      <p
                        v-if="item.attachments[0].title"
                        class="text-muted-800 dark:text-muted-100 font-sans text-sm mb-1"
                      >
                        {{ item.attachments[0].title }}
                      </p>
                      <p
                        v-else
                        class="text-muted-800 dark:text-muted-100 font-sans"
                      >
                        {{
                          item.attachments[0].url?.replace(/(^\w+:|^)\/\//, '')
                        }}
                      </p>
                      <p class="text-muted-400 font-sans text-xs">
                        {{ item.attachments[0].description }}
                      </p>
                    </div>
                  </div>

                  <div
                    v-else
                    class="max-w-xs rounded-2xl bg-white dark:bg-muted-800 p-2"
                    :class="
                      isSender(item) ? 'rounded-se-none ' : 'rounded-ss-none'
                    "
                  >
                    <div class="rounded-xl overflow-hidden">
                      <img
                        loading="lazy"
                        :src="item.attachments[0].image"
                        :alt="item.attachments[0].title"
                        class="transform transition-all duration-300 hover:scale-105"
                      />
                    </div>
                    <div class="px-1 py-2">
                      <p
                        v-if="item.attachments[0].title"
                        class="text-muted-800 dark:text-muted-100 font-sans text-sm mb-1"
                      >
                        {{ item.attachments[0].title }}
                      </p>
                      <p
                        v-else
                        class="text-muted-800 dark:text-muted-100 font-sans"
                      >
                        {{
                          item.attachments[0].url?.replace(/(^\w+:|^)\/\//, '')
                        }}
                      </p>
                      <p class="text-muted-400 font-sans text-xs">
                        {{ item.attachments[0].description }}
                      </p>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </template>
          </div>
          <!-- For multiple images -->
          <div
            v-else
            class="grid grid-cols-2 gap-2"
            :class="[isSender(item) ? 'rounded-se-none' : 'rounded-ss-none']"
          >
            <template v-for="(attachment, idx) in item.attachments" :key="idx">
              <div v-if="attachment.type === 'image'">
                <div class="image-container">
                  <img
                    loading="lazy"
                    :src="attachment.image"
                    :alt="attachment.text"
                    class="dark:bg-muted-800 rounded-2xl bg-white p-1"
                    @click="openLightbox(attachment.image)"
                  />
                  <div class="overlay" @click="openLightbox(attachment.image)">
                    <Icon name="lucide:zoom-in" class="h-5 w-5 zoom-icon" />
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>

        <div
          v-else
          class="bg-muted-200 dark:bg-muted-800 rounded-xl p-4 text-left"
          :class="isSender(item) ? 'rounded-se-none' : 'rounded-ss-none'"
        >
          <p class="font-sans text-sm">{{ item.text }}</p>
        </div>
        <div
          class="text-muted-400 mt-1 font-sans text-xs"
          :class="isSender(item) ? 'text-right' : 'text-left'"
        >
          {{ timeAgo(new Date(item.time)) }} ago
        </div>
      </div>
    </template>
    <div v-else>
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div
          class="border-muted-300/50 dark:border-muted-800 w-full border-t"
        ></div>
      </div>
      <div class="relative flex justify-center">
        <span
          class="bg-muted-100 dark:bg-muted-900 text-muted-400 px-3 font-sans text-xs uppercase"
        >
          {{ item.time }}
        </span>
      </div>
    </div>
    <VueEasyLightbox
      :visible="isLightboxOpen"
      :imgs="[currentImage]"
      @hide="closeLightbox"
    ></VueEasyLightbox>
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
  display: inline-block;
}

.image-container:hover .overlay {
  opacity: 1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.zoom-icon {
  font-size: 2rem;
  color: white;
}
</style>
