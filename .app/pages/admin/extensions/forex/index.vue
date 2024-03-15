<script setup lang="ts">
definePageMeta({
  permissions: ['Access Forex Management'],
  title: 'Forex Management',
})

const { updateSettings } = useSettings()
const settingsStore = useSettingsStore()
const { useSparklineConfiguration } = useUtils()
const settings = computed(() => settingsStore.settings)

const { getForexAnalytics } = useForex()
const { toast } = useUtils()

const forexInvestment = ref(settings.value?.forex_investment || false)
const forexDepositWalletType = ref(
  settings.value?.forex_deposit_wallet_type || 'FIAT',
)
const updateSetting = async () => {
  try {
    const response = await updateSettings({
      forex_investment: forexInvestment.value,
      forex_deposit_wallet_type: forexDepositWalletType.value,
    })
    toast.response(response)
    if (response.status) {
      await updateSettings(forexInvestment.value)
      await settingsStore.invalidateCacheAndFetch()
    }
  } catch (error) {
    toast.danger(error as any)
  }
}

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

const forexCharts = ref([
  createChartConfig('Total Accounts', 'mdi:users', 'primary'),
  createChartConfig('Active Accounts', 'mdi:users-check', 'success'),
  createChartConfig('Total Plans', 'fluent-mdl2:diet-plan-notebook', 'info'),
  createChartConfig('Active Plans', 'icon-park-outline:plan', 'warning'),
  createChartConfig(
    'Total Investments',
    'streamline:investment-selection',
    'danger',
  ),
  createChartConfig(
    'Active Investments',
    'streamline:investment-selection-solid',
    'info',
  ),
  createChartConfig(
    'Completed Investments',
    'fluent-mdl2:completed',
    'success',
  ),
  createChartConfig(
    'Total Invested',
    'octicon:tracked-by-closed-completed-24',
    'success',
  ),
  createChartConfig('Total Profit', 'solar:wallet-money-bold-duotone', 'info'),
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

onMounted(async () => {
  const response = await getForexAnalytics()
  if (response.status) {
    const forexData = response.data

    const dataKeys = [
      'totalForexAccounts',
      'activeForexAccounts',
      'totalForexPlans',
      'activeForexPlans',
      'totalForexInvestments',
      'activeForexInvestments',
      'completedForexInvestments',
      'totalInvestedInForex',
      'totalProfitFromForex',
    ]

    forexCharts.value.forEach((chart, index) => {
      const key = dataKeys[index]
      if (forexData[key]) {
        chart.data = useSparklineConfiguration(
          undefined,
          'forex',
          chart.data.series[0].name,
          chart.iconColor,
          transformToCountsPerDay(forexData[key]),
        )
      }
    })
  }
})
</script>

<template>
  <div class="space-y-5">
    <div class="grid grid-cols-12 gap-6">
      <div
        class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3"
        v-for="(chart, index) in forexCharts"
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
          category="stock-market"
          url="predictive-analysis"
          max="2"
          class="max-w-sm"
        />
      </div>
      <div>
        <BaseCard class="p-5 space-y-5">
          <BaseSwitchBall
            v-model="forexInvestment"
            label="Forex Investments"
            sublabel="Enable or disable forex investments"
            color="primary"
            @update:model-value="updateSetting"
          />
          <BaseListbox
            v-model="forexDepositWalletType"
            label="Forex Deposit Wallet Type"
            placeholder="Select the wallet type for forex deposits"
            :items="['FIAT', 'SPOT', 'FUNDING']"
            shape="rounded"
            @update:model-value="updateSetting"
          />
        </BaseCard>
      </div>
    </div>
  </div>
</template>
