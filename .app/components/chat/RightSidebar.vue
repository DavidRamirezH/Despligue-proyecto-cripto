<script lang="ts" setup>
import { useUserSupportStore } from '~~/store/support/user'
import { useAdminSupportStore } from '~~/store/support/admin'
const props = defineProps<{
  isSupport: boolean
  expanded: boolean
  loading: boolean
  ticket: any
  uuid: string
  toggleExpanded: () => void
}>()

const { closeTicket, openTicket } = useSupport()
const { toast } = useUtils()
let supportStore: any
if (props.isSupport) {
  supportStore = useAdminSupportStore()
} else {
  supportStore = useUserSupportStore()
}
const close = async () => {
  try {
    const response = await closeTicket(uuid)
    toast.response(response)
    await supportStore.fetchTickets()
  } catch (error) {
    toast.danger(error as any)
  }
}

const open = async () => {
  try {
    const response = await openTicket(uuid)
    toast.response(response)
    await supportStore.fetchTickets()
  } catch (error) {
    toast.danger(error as any)
  }
}

const status = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'warning'
    case 'OPEN':
      return 'success'
    case 'CLOSED':
      return 'danger'
    case 'REPLIED':
      return 'primary'
    default:
      return 'info'
  }
}

const importance = (importance: string) => {
  switch (importance) {
    case 'LOW':
      return 'info'
    case 'MEDIUM':
      return 'warning'
    case 'HIGH':
      return 'danger'
    default:
      return 'info'
  }
}
</script>

<template>
  <div
    class="ltablet:w-[310px] dark:bg-muted-800 fixed end-0 top-0 z-20 h-full w-[390px] bg-white transition-transform duration-500 max-h-screen overflow-y-auto"
    :class="expanded ? 'translate-x-full' : 'translate-x-0'"
  >
    <div class="flex h-16 w-full items-center justify-between px-8">
      <BaseHeading tag="h3" size="lg" class="text-muted-800 dark:text-white">
        <span>{{ $t('Ticket details') }}</span>
      </BaseHeading>
      <BaseButtonIcon small @click="toggleExpanded">
        <Icon name="lucide:arrow-right" class="pointer-events-none h-4 w-4" />
      </BaseButtonIcon>
    </div>
    <div class="relative flex w-full flex-col px-8">
      <!-- Loader -->
      <div v-if="loading" class="mt-8">
        <div class="mb-3 flex items-center justify-center">
          <BasePlaceload
            class="h-24 w-24 shrink-0 rounded-full"
            :width="96"
            :height="96"
          />
        </div>
        <div class="flex flex-col items-center">
          <BasePlaceload class="mb-2 h-3 w-full max-w-[10rem] rounded" />
          <BasePlaceload class="mb-2 h-3 w-full max-w-[6rem] rounded" />
          <div class="my-4 flex w-full flex-col items-center">
            <BasePlaceload class="mb-2 h-2 w-full max-w-[15rem] rounded" />
            <BasePlaceload class="mb-2 h-2 w-full max-w-[13rem] rounded" />
          </div>
          <div class="mb-6 flex w-full items-center justify-center">
            <div class="px-4">
              <BasePlaceload class="h-3 w-[3.5rem] rounded" />
            </div>
            <div class="px-4">
              <BasePlaceload class="h-3 w-[3.5rem] rounded" />
            </div>
          </div>
          <div class="w-full">
            <BasePlaceload class="h-10 w-full rounded-xl" />
            <BasePlaceload class="mx-auto mt-3 h-3 w-[7.5rem] rounded" />
          </div>
        </div>
      </div>
      <!-- User details -->
      <div v-else class="mt-8">
        <div class="flex items-center justify-center">
          <div class="flex flex-wrap items-end gap-4">
            <BaseAvatar
              :src="
                isSupport
                  ? ticket?.user?.avatar || '/img/avatars/1.svg'
                  : ticket?.agent?.avatar || '/img/avatars/1.svg'
              "
              size="2xl"
              shape="full"
            />
          </div>
        </div>
        <div class="text-center space-y-5 mt-5" :key="ticket?.status">
          <div class="text-muted-600 dark:text-gray-300">
            <strong>{{ isSupport ? 'Client' : 'Agent' }}: </strong>
            <span class="">
              {{
                isSupport
                  ? ticket?.user?.first_name + ' ' + ticket?.user?.last_name
                  : ticket?.chat?.agent !== null
                    ? ticket?.chat?.agent?.first_name +
                      ' ' +
                      ticket?.chat?.agent?.last_name
                    : 'N/A'
              }}</span
            >
          </div>
          <BaseHeading
            as="h4"
            size="lg"
            weight="semibold"
            class="text-muted-800 dark:text-white"
          >
            Ticket: #{{ ticket?.uuid }}
          </BaseHeading>
          <div class="flex justify-center items-center gap-2">
            <BaseTag :color="status(ticket?.status)" flavor="pastel">
              {{ ticket?.status }}
            </BaseTag>
            <BaseTag :color="importance(ticket?.importance)" flavor="pastel">
              {{ ticket?.importance }}
            </BaseTag>
          </div>
          <div class="space-y-1">
            <div
              class="col-span-2 lg:col-span-1 text-muted-600 dark:text-gray-300"
            >
              <strong>{{ $t('Subject') }}:</strong>
              <span class="block md:inline">{{ ticket?.subject }}</span>
            </div>

            <!-- Date created -->
            <div
              class="col-span-2 lg:col-span-1 text-muted-600 dark:text-gray-300"
            >
              <strong>{{ $t('Created At') }}:</strong>
              <span class="block md:inline">{{
                new Date(ticket?.created_at).toLocaleString()
              }}</span>
            </div>
          </div>
          <div>
            <BaseButton
              v-if="ticket?.status !== 'CLOSED'"
              @click="close()"
              class="w-full"
              color="danger"
            >
              <Icon name="line-md:close" class="h-4 w-4" />
              <span class="mr-2">{{ $t('Close Ticket') }}</span>
            </BaseButton>
            <BaseButton
              v-if="isSupport && ticket?.status === 'CLOSED'"
              @click="open()"
              class="w-full"
              color="success"
            >
              <Icon name="line-md:confirm" class="h-4 w-4" />
              <span class="mr-2">{{ $t('Open Ticket') }}</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
