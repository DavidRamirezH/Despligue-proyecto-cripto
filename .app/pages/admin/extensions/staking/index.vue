<script setup lang="ts">
definePageMeta({
  permissions: ['Access Staking Management'],
  title: 'Staking Management',
})
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

const stakingCharts = ref([
  createChartConfig('Total Pools', 'clarity:resource-pool-line', 'primary'),
  createChartConfig('Active Pools', 'clarity:resource-pool-solid', 'success'),
  createChartConfig('Total Stakes', 'icon-park-outline:data-all', 'info'),
  createChartConfig('Active Stakes', 'icon-park-twotone:data-all', 'success'),
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

const { getAdminStakingAnalytics } = useStaking() // Adjust this to your actual composable
onMounted(async () => {
  const response = await getAdminStakingAnalytics()
  if (response.status) {
    const stakingData = response.data

    const dataKeys = [
      'totalStakingPools',
      'activeStakingPools',
      'totalStakes',
      'activeStakes',
    ]

    stakingCharts.value.forEach((chart, index) => {
      const key = dataKeys[index]
      if (stakingData[key]) {
        chart.data = useSparklineConfiguration(
          undefined,
          'staking',
          chart.data.series[0].name,
          chart.iconColor,
          transformToCountsPerDay(stakingData[key]),
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
        v-for="(chart, index) in stakingCharts"
        :key="index"
      >
        <AdminMonthChart
          :chartData="chart.data"
          :icon="chart.icon"
          :icon-color="chart.iconColor"
        />
      </div>
    </div>
    <div class="flex items-center justify-center mt-5 mb-10">
      <MashLottie category="finance-2" url="budget" max="2" class="max-w-lg" />
    </div>
  </div>
</template>
