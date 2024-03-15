<script setup lang="ts">
import { useUserSupportStore } from '~~/store/support/user'
import { useAdminSupportStore } from '~~/store/support/admin'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

const props = defineProps({
  isSupport: {
    type: Boolean,
    required: true,
  },
})

const { sendMessage, getMetadata } = useSupport()

let supportStore: any
if (props.isSupport) {
  supportStore = useAdminSupportStore()
} else {
  supportStore = useUserSupportStore()
}
const { toast } = useUtils()
const route = useRoute()
const { uuid } = route.params
const ticket = computed(() => supportStore.tickets.find((t) => t.uuid === uuid))
const chat = computed(() => supportStore?.chat)
const chatUuid = computed(() => chat?.value?.uuid)
const client_id = computed(() => chat.value?.user_id)
const agent_id = computed(() => chat.value?.agent_id)
const { assignAgent } = useSupport()

const config = useRuntimeConfig()
let socket: WebSocket

const SearchElement = ref<HTMLElement>()
const ChatBody = ref<HTMLElement>()
const viewport = useViewport()
const expanded = ref(viewport.isGreaterOrEquals('sm') ? false : true)
const toggleExpanded = () => {
  expanded.value = !expanded.value
}

const loading = ref(false)
const message = ref('')
const messageLoading = ref(false)
const inputFile = ref<FileList | null>(null)
let oldId: any = null

onMounted(async () => {
  if (supportStore.tickets.length === 0) {
    await supportStore.fetchTickets()
  }
  if (props.isSupport && ticket.value?.chat?.agent_id === null) {
    const response = await assignAgent(ticket.value?.uuid)
    toast.response(response)
    if (response.status) {
      supportStore.tickets.find((t) => t.uuid === uuid).chat.agent_id =
        response.data.agent_id
    }
  }
  if (supportStore.chat === null) {
    await supportStore.fetchChat(uuid)
  }

  setupChat()
})

function setupChat() {
  if (chat.value) {
    if (!chat.value.messages) {
      chat.value.messages = {}
    }

    for (const item of Object.values(chat.value.messages)) {
      if (item.attachments && item.attachments[0]) {
        checkImageSize(item.attachments[0].image)
      }
    }

    setTimeout(scrollToEnd, 300)
  }
}

onBeforeUnmount(() => {
  if (socket) {
    socket.close()
  }
})

watch(
  () => chat.value?.id,
  (newId) => {
    if (newId !== oldId) {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
      initSocket()
      oldId = newId
    }
  },
)

watch(inputFile, (value) => {
  if (value?.length) {
    upload(value)
  }
})

function scrollToEnd() {
  if (ChatBody.value) {
    ChatBody.value.scrollTo({
      top: ChatBody.value.scrollHeight,
      behavior: 'smooth',
    })
  } else {
    console.error('ChatBody.value is null')
  }
}

function initSocket() {
  if (!socket) {
    createWebSocketConnection()
  }
  if (socket) {
    startHeartbeat()

    socket.addEventListener('message', (event) => {
      if (event.data instanceof Blob) {
        processBlobMessage(event)
      } else if (typeof event.data === 'string') {
        processStringMessage(event)
      } else {
        console.error('Received non-string, non-blob message:', event.data)
      }
    })
  }
}

function createWebSocketConnection() {
  if (agent_id.value !== null) {
    const chatUrl = `${config.public.appWebSocketUrl}/chat/?chatUuid=${chatUuid.value}&clientId=${client_id.value}&agentId=${agent_id.value}&isSupport=${props.isSupport}`
    socket = new WebSocket(chatUrl)
    socket.onopen = () => {
      console.log('WebSocket is open now.')
    }
    socket.onerror = (error) => {
      console.log('WebSocket Error: ', error)
    }
  } else {
    console.error('No agent assigned to this chat.')
  }
}

function startHeartbeat() {
  setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send('heartbeat')
    }
  }, 30000)
}

///////////// Start Messages ///////////////

const processMessage = (message: { attachments: any; type: string }) => {
  let attachments: (
    | {
        type: string
        image: any
        text: any
        url?: undefined
        title?: undefined
        description?: undefined
      }
    | {
        type: string
        url: any
        image: any
        title: any
        description: any
        text?: undefined
      }
    | undefined
  )[] = []
  if (message.attachments && Array.isArray(message.attachments)) {
    attachments = processAttachments(message.attachments)
  }

  const newMessage = createNewMessageFromIncoming(message, attachments)
  updateLocalConversations(newMessage)

  supportStore.tickets.find((t) => t.uuid === uuid).status = 'REPLIED'

  setTimeout(scrollToEnd, 300)
}

function processBlobMessage(event: MessageEvent<any>) {
  let reader = new FileReader()
  reader.addEventListener('loadend', () => {
    const message = JSON.parse(reader.result)
    processMessage(message)
  })
  reader.readAsText(event.data)
}

function processStringMessage(event: MessageEvent<any>) {
  const message = JSON.parse(event.data)

  processMessage(message)
}

function processAttachments(attachments: any[]) {
  return attachments.map(
    (attachment: {
      type: string
      image: any
      text: any
      url: any
      title: any
      description: any
    }) => {
      if (attachment.type === 'image') {
        return {
          type: 'image',
          image: attachment.image,
          text: attachment.text || '',
        }
      } else if (attachment.type === 'link') {
        return {
          type: 'link',
          url: attachment.url,
          image: attachment.image,
          title: attachment.title,
          description: attachment.description,
        }
      }
    },
  )
}

function createNewMessageFromIncoming(
  message: { text: any; agent_id: any; user_id: any },
  attachments: any,
) {
  const now = new Date()
  const currentTime = now.toLocaleString()
  let type: string

  if (props.isSupport) {
    type = 'client'
  } else {
    type = 'agent'
  }

  return {
    type,
    text: message.text,
    time: currentTime,
    user_id: message.user_id,
    agent_id: message.agent_id,
    attachments,
  }
}

function createNewMessage({
  type,
  text,
  time,
  user_id,
  agent_id,
  attachments,
}) {
  return {
    type,
    text,
    time,
    user_id,
    agent_id,
    attachments,
  }
}

async function sendMessageToBackend(newMessage: {
  type: any
  text: any
  time: any
  user_id: any
  agent_id: any
  attachments: any
}) {
  if (!client_id.value || !agent_id.value) {
    return toast.dangerText('User ID or Agent ID is missing.')
  }

  if (ticket.value?.status === 'PENDING' && !props.isSupport) {
    return toast.dangerText('Please wait for a reply from the support team.')
  }

  if (ticket.value?.status === 'CLOSED') {
    return toast.dangerText(
      'You cannot send a message to a closed ticket. Please open a new ticket.',
    )
  }

  try {
    const response = await sendMessage(
      ticket.value?.uuid,
      newMessage,
      props.isSupport,
    )
    if (!response.status) {
      toast.danger(response)
      if (response.error.status === 404) {
        supportStore.tickets.find((t) => t.uuid === uuid).status = 'CLOSED'
      }
      return
    }
    try {
      socket.send(JSON.stringify(newMessage))
    } catch (error) {
      console.error('Error sending message to websocket:', error)
      toast.danger(error as any)
    }
    updateLocalConversations(newMessage)
    supportStore.tickets.find((t) => t.uuid === uuid).status = props.isSupport
      ? 'REPLIED'
      : 'OPEN'
  } catch (error) {
    toast.danger(error as any)
  }
}

function updateLocalConversations(newMessage: unknown) {
  let messagesArray = Object.values(supportStore.chat.messages)
  messagesArray.push(newMessage)
  supportStore.chat.messages = { ...messagesArray }
}

///////////// End Messages //////////////////

const imageSizes = ref<any>({})

const checkImageSize = (imageUrl: any) => {
  let img = new Image()
  img.onload = function () {
    imageSizes.value[imageUrl] = { width: this.width, height: this.height }
  }
  img.src = imageUrl
}

const showEmojiPicker = ref(false)

const onSelectEmoji = (emoji: any) => {
  message.value += emoji.i
  showEmojiPicker.value = false
}

const submitting = ref(false)
async function submitMessage() {
  if (!message.value || messageLoading.value) return

  submitting.value = true

  messageLoading.value = true

  try {
    const now = new Date()
    const currentTime = now.toLocaleString()

    const urlRegex = /(https?:\/\/[^\s]+)/g
    const urls = message.value.match(urlRegex)
    const firstUrl = urls && urls.length > 0 ? urls[0] : null

    let attachment = null
    if (firstUrl) {
      const response = await getMetadata(firstUrl)
      const metadata = response.data

      if (metadata.title && metadata.image) {
        attachment = {
          type: 'link',
          image: metadata.image,
          url: firstUrl,
          title: metadata.title,
          description: metadata.description,
        }

        if (message.value.trim() === firstUrl) {
          message.value = ''
        }
      }
    }

    const newMessage = createNewMessage({
      type: props.isSupport ? 'agent' : 'client',
      text: message.value,
      time: currentTime,
      user_id: client_id.value,
      agent_id: agent_id.value,
      attachments: attachment ? [attachment] : [],
    })

    await sendMessageToBackend(newMessage)

    message.value = ''
    messageLoading.value = false

    await nextTick()

    let inputElement = document.getElementById('messageInput')
    if (inputElement) {
      inputElement.focus()
    }

    scrollToEnd()
  } catch (error) {
    console.log(error)

    toast.danger(error as any)
  } finally {
    messageLoading.value = false
  }
}

const { uploadFile } = useAuth()
async function upload(fileList: FileList) {
  if (messageLoading.value) return

  messageLoading.value = true

  try {
    let files = []
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i)
      if (file) {
        files.push(file)
      }
    }

    const uploadResponse = await uploadFile('chat', files)

    if (uploadResponse.status) {
      const newMessage = createNewMessage({
        type: props.isSupport ? 'agent' : 'client',
        text: '',
        time: new Date().toISOString(),
        user_id: client_id.value,
        agent_id: agent_id.value,
        attachments: uploadResponse.data.map((filePath: any) => ({
          type: 'image',
          image: filePath,
          text: '',
        })),
      })

      await sendMessageToBackend(newMessage)

      inputFile.value = null

      await nextTick()

      scrollToEnd()
    } else {
      throw new Error(uploadResponse.error.message)
    }
  } catch (error) {
    toast.danger(error as any)
  } finally {
    messageLoading.value = false
  }
}
</script>

<template>
  <div class="relative">
    <div class="bg-muted-100 dark:bg-muted-900 flex min-h-screen">
      <!-- Sidebar -->
      <ChatLeftSidebar :is-support="isSupport" />
      <!-- Current conversation -->
      <div
        class="relative w-full transition-all duration-500"
        :class="
          expanded
            ? ''
            : 'ltablet:max-w-[calc(100%_-_470px)] lg:max-w-[calc(100%_-_470px)]'
        "
      >
        <div class="flex w-full flex-col">
          <!-- Header -->
          <div
            class="flex h-16 w-full items-center justify-between px-4 sm:px-8 gap-4"
          >
            <ChatSearch
              :chat="chat"
              :element="SearchElement"
              :submitting="submitting"
              :is-support="isSupport"
            />

            <MashSidebarTools
              class="relative -end-4 z-20 flex h-16 w-full scale-90 items-center justify-end gap-2 sm:end-0 sm:scale-100"
            />
            <BaseButton
              v-if="$viewport.isGreaterOrEquals('sm') && expanded"
              @click="toggleExpanded"
            >
              <span class="mr-2">{{ $t('Details') }}</span>
              <Icon name="lucide:arrow-right" class="h-4 w-4" />
            </BaseButton>
            <span
              v-if="$viewport.isLessThan('sm') && expanded"
              @click="toggleExpanded"
              class="disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-none false text-primary-500 border-2 border-primary-500 hover:bg-primary-500/20 false rounded-full h-8 w-8 p-2 nui-focus relative inline-flex items-center justify-center space-x-1 font-sans text-sm font-normal leading-5 no-underline outline-none transition-all duration-300"
            >
              <Icon name="line-md:chevron-right" class="h-5 w-5" />
            </span>
          </div>

          <!-- Body -->
          <div
            ref="ChatBody"
            class="relative h-[calc(100vh_-_128px)] w-full p-4 sm:p-8"
            :class="loading ? 'overflow-hidden' : 'overflow-y-auto slimscroll'"
          >
            <!-- Loader-->
            <div
              class="bg-muted-100 dark:bg-muted-900 pointer-events-none absolute inset-0 z-10 h-full w-full p-8 transition-opacity duration-300"
              :class="loading ? 'opacity-100' : 'opacity-0 pointer-events-none'"
            >
              <ChatLoader />
            </div>
            <!-- Messages loop -->
            <div
              v-if="chat && chat.messages"
              class="space-y-8"
              ref="SearchElement"
            >
              <ChatMessages
                :chat="chat"
                :is-support="isSupport"
                :image-sizes="imageSizes"
                :ticket="ticket"
              />
            </div>
          </div>
          <!-- Compose -->
          <form
            method="POST"
            action=""
            @submit.prevent="submitMessage"
            class="bg-muted-100 dark:bg-muted-900 flex h-16 w-full items-center px-4 sm:px-8"
          >
            <div class="relative w-full">
              <BaseInput
                id="messageInput"
                v-model.trim="message"
                :disabled="messageLoading"
                shape="full"
                :classes="{
                  input: 'h-12 ps-6 pe-24',
                }"
                placeholder="Write a message..."
              />
              <div
                v-if="showEmojiPicker"
                class="absolute bottom-12 right-0 z-50"
              >
                <EmojiPicker
                  :native="true"
                  @select="onSelectEmoji"
                  theme="auto"
                  :display-recent="true"
                  :disable-skin-tones="true"
                />
              </div>
              <div class="absolute end-2 top-0 flex h-12 items-center gap-1">
                <button
                  type="button"
                  class="text-muted-400 hover:text-primary-500 flex h-12 w-10 items-center justify-center transition-colors duration-300"
                  @click="showEmojiPicker = !showEmojiPicker"
                >
                  <Icon name="lucide:smile" class="h-5 w-5" />
                </button>

                <BaseFullscreenDropfile
                  icon="ph:image-duotone"
                  :filter-file-dropped="
                    (file: { type: string }) => file.type.startsWith('image')
                  "
                  @drop="
                    (
                      value: {
                        [x: number]: File
                        readonly length: number
                        item: (index: number) => File | null
                        [Symbol.iterator]: () => IterableIterator<File>
                      } | null,
                    ) => {
                      inputFile = value
                    }
                  "
                />
                <BaseInputFileHeadless
                  accept="image/*"
                  multiple
                  v-model="inputFile"
                  v-slot="{ open, remove, preview, files }"
                >
                  <div
                    data-nui-tooltip="Upload image"
                    class="text-muted-400 hover:text-primary-500 flex items-center justify-center transition-colors duration-300 mr-2"
                  >
                    <Icon
                      name="lucide:paperclip"
                      class="h-5 w-5"
                      @click="open"
                    />
                  </div>
                </BaseInputFileHeadless>
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- Current user -->
      <ChatRightSidebar
        :is-support="isSupport"
        :ticket="ticket"
        :loading="loading"
        :uuid="uuid"
        :expanded="expanded"
        :toggle-expanded="toggleExpanded"
      />
    </div>

    <MashPanels />
  </div>
</template>
