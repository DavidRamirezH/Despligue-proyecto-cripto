<script setup lang="ts">
definePageMeta({
  permissions: ['Access P2P Management'],
  title: 'P2P Management',
})
const { updateSettings } = useSettings()
const settingsStore = useSettingsStore()
const userStore = useUserStore()
const userPermissions = computed(() => userStore.getPermissions)
const userRole = computed(() => userStore.getRole)
const settings = computed(() => settingsStore.settings)
const { useSparklineConfiguration } = useUtils()
function createChartConfig(name, icon, iconColor) {
  return {
    data: {
      type: 'area',
      height: 130,
      options: {},
      series: [{ name, data: [] }],
    },
    icon,
    iconColor,
  }
}

const p2pCharts = ref([
  createChartConfig('Total Offers', 'ic:twotone-local-offer', 'primary'),
  createChartConfig('Active Offers', 'ic:twotone-local-offer', 'success'),
  createChartConfig('Total Trades', 'tabler:exchange', 'info'),
  createChartConfig('Completed Trades', 'tabler:exchange', 'info'),
  createChartConfig('Total Disputes', 'tabler:exchange-off', 'danger'),
  createChartConfig(
    'Resolved Disputes',
    'material-symbols-light:partner-exchange',
    'warning',
  ),
])

function transformToCountsPerDay(data) {
  if (!data || !Array.isArray(data)) {
    return Array(30).fill(0)
  }

  const last30Days = [...Array(30)]
    .map((_, i) => {
      const d = new Date()
      d.setUTCDate(d.getUTCDate() - i)
      return d.toISOString().split('T')[0]
    })
    .reverse()

  const countMap = new Map(data.map((item) => [item.date, item.count]))
  return last30Days.map((date) => countMap.get(date) || 0)
}

const { getAdminP2pAnalytics } = useP2P() // Adjust this to your actual composable
onMounted(async () => {
  const response = await getAdminP2pAnalytics()
  if (response.status) {
    const p2pData = response.data

    const dataKeys = [
      'totalP2POffers',
      'activeP2POffers',
      'totalP2PTrades',
      'completedP2PTrades',
      'totalP2PDisputes',
      'resolvedP2PDisputes',
    ]

    p2pCharts.value.forEach((chart, index) => {
      const key = dataKeys[index]
      if (p2pData[key]) {
        chart.data = useSparklineConfiguration(
          undefined,
          'p2p',
          chart.data.series[0].name,
          chart.iconColor,
          transformToCountsPerDay(p2pData[key]),
        )
      }
    })
  }
})

const { toast } = useUtils()

const p2p_trade_commission = ref(settings.value?.p2p_trade_commission || 0)
const updateSetting = async () => {
  if (
    !userPermissions.value.some((permission) =>
      permission.includes('Access Settings'),
    ) &&
    userRole.value !== 'Super Admin'
  ) {
    toast.dangerText('You do not have permission to edit the default layout.')
    return
  }
  try {
    const response = await updateSettings({
      p2p_trade_commission: p2p_trade_commission.value,
    })
    toast.response(response)
    if (response.status) {
      await updateSettings(p2p_trade_commission.value)
      await settingsStore.invalidateCacheAndFetch()
    }
  } catch (error) {
    toast.danger(error as any)
  }
}
</script>

<template>
  <div class="space-y-10">
    <div class="grid grid-cols-12 gap-6">
      <div
        class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3"
        v-for="(chart, index) in p2pCharts"
        :key="index"
      >
        <AdminMonthChart
          :chartData="chart.data"
          :icon="chart.icon"
          :icon-color="chart.iconColor"
        />
      </div>
    </div>
    <div
      class="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 items-center"
    >
      <div class="flex items-center justify-center mb-10">
        <MashLottie
          category="finance-2"
          url="literature"
          max="2"
          class="max-w-lg"
        />
      </div>
      <div>
        <BaseCard class="p-5">
          <BaseInput
            v-model="p2p_trade_commission"
            label="P2P Trade Commission"
            placeholder="This is the commission charged on every P2P trade"
            type="number"
            icon="%"
            @update:model-value="updateSetting"
          />
          <small>
            <span class="text-xs text-muted-500 dark:text-muted-400">
              Please note that this commission is charged on every P2P trade
            </span>
          </small>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
