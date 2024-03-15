<script setup lang="ts">
definePageMeta({
  permissions: ['Access AI Trading Management'],
  title: 'AI Trading Management',
})
const { getAdminAiTradingAnalytics } = useAiTrading()
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

const aiCharts = ref([
  createChartConfig('Total Trades', 'eos-icons:ai-operator', 'info'),
  createChartConfig('Active Trades', 'tabler:file-text-ai', 'warning'),
  createChartConfig('Completed Trades', 'streamline:ai-chip-spark', 'success'),
  createChartConfig(
    'Total Investments',
    'streamline:investment-selection',
    'danger',
  ),
  createChartConfig('Total Profit', 'game-icons:profit', 'success'),
])

function transformToCountsPerDay(data) {
  if (!data || !Array.isArray(data)) {
    // Return an array of 30 zeros if data is not in the expected format
    return Array(30).fill(0)
  }

  const last30Days = [...Array(30)]
    .map((_, i) => {
      const d = new Date()
      d.setUTCDate(d.getUTCDate() - i)
      return d.toISOString().split('T')[0] // Ensure the date format is YYYY-MM-DD
    })
    .reverse()

  const countMap = new Map(data.map((item) => [item.date, item.count]))
  return last30Days.map((date) => countMap.get(date) || 0)
}

onMounted(async () => {
  const response = await getAdminAiTradingAnalytics()
  if (response.status) {
    const aiData = response.data

    const dataKeys = [
      'totalAiTrades',
      'activeAiTrades',
      'completedAiTrades',
      'totalInvestedInAi',
      'totalProfitFromAi',
    ]

    aiCharts.value.forEach((chart, index) => {
      const key = dataKeys[index]
      if (aiData[key]) {
        chart.data = useSparklineConfiguration(
          undefined,
          'ai',
          chart.data.series[0].name,
          chart.iconColor,
          transformToCountsPerDay(aiData[key]),
        )
      }
    })
  }
})
</script>
<template>
  <div>
    <div class="grid grid-cols-12 gap-6">
      <div
        class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3"
        v-for="(chart, index) in aiCharts"
        :key="index"
      >
        <AdminMonthChart
          :chartData="chart.data"
          :icon="chart.icon"
          :icon-color="chart.iconColor"
        />
      </div>
    </div>
    <div class="flex items-center justify-center mt-5">
      <MashLottie category="stock-market" url="ai" class="max-w-lg" />
    </div>
  </div>
</template>
