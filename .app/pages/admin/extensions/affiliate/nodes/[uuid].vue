<script setup lang="ts">
definePageMeta({
  title: 'MLM Referral Details',
  permissions: ['View MLM Referrals'],
})

const node = ref<any>(null)
const { getNodeByUserId } = useMlm()
const route = useRoute()
const router = useRouter()
const { toast } = useUtils()
const uuid = computed(() => route.params.uuid)

onMounted(async () => {
  try {
    const response = await getNodeByUserId(uuid.value)
    node.value = response.data
  } catch (error) {
    router.back()
    toast.danger(error as any)
  }
})
</script>

<template>
  <MashContentWrapper>
    <template #right>
      <BaseButton @click="router.back()" color="muted">
        <Icon name="line-md:chevron-left" class="mr-2" /> {{ $t('Back') }}
      </BaseButton>
    </template>

    <MlmTree :isAdmin="true" :uuid="uuid" />
  </MashContentWrapper>
</template>
