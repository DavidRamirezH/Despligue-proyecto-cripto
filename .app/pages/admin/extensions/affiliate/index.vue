<script setup lang="ts">
definePageMeta({
  permissions: ['Access MLM Management'],
  title: 'MLM Management',
})

const { getAnalytics } = useMlm()
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

const mlmCharts = ref([
  createChartConfig(
    'Total Referrals',
    'solar:users-group-rounded-bold-duotone',
    'primary',
  ),
  createChartConfig(
    'Active Referrals',
    'solar:users-group-rounded-bold-duotone',
    'success',
  ),
  createChartConfig('Total Rewards', 'fluent:reward-20-filled', 'info'),
  createChartConfig('Claimed Rewards', 'fluent:reward-20-filled', 'warning'),
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
  const response = await getAnalytics()
  if (response.status) {
    const mlmData = response.data

    const dataKeys = [
      'totalMLMReferrals',
      'activeMLMReferrals',
      'totalMLMRewards',
      'claimedMLMRewards',
    ]

    mlmCharts.value.forEach((chart, index) => {
      const key = dataKeys[index]
      if (mlmData[key]) {
        chart.data = useSparklineConfiguration(
          undefined,
          'mlm',
          chart.data.series[0].name,
          chart.iconColor,
          transformToCountsPerDay(mlmData[key]),
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
        v-for="(chart, index) in mlmCharts"
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
      <MashLottie category="marketing" url="social" max="2" class="max-w-lg" />
    </div>
  </div>
</template>
