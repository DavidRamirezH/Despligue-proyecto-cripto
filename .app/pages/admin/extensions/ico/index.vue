<script setup lang="ts">
definePageMeta({
  permissions: ['Access Ico Management'],
  title: 'Ico Management',
})
const { getIcoAnalytics } = useIco()
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

const icoCharts = ref([
  createChartConfig(
    'Total Projects',
    'material-symbols:all-inbox-outline',
    'primary',
  ),
  createChartConfig('Active Projects', 'fluent-mdl2:view-all-2', 'success'),
  createChartConfig('Total Tokens', 'fluent-mdl2:all-currency', 'info'),
  createChartConfig('Active Tokens', 'mdi:currency-usd', 'warning'),
  createChartConfig('Total Phases', 'codicon:layers', 'danger'),
  createChartConfig('Active Phases', 'codicon:layers-dot', 'success'),
  createChartConfig('Total Allocations', 'codicon:layers-active', 'primary'),
  createChartConfig(
    'Total Contributions',
    'ooui:user-contributions-ltr',
    'success',
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

onMounted(async () => {
  const response = await getIcoAnalytics()
  if (response.status) {
    const icoData = response.data

    const dataKeys = [
      'totalIcoProjects',
      'activeIcoProjects',
      'totalIcoTokens',
      'activeIcoTokens',
      'totalIcoPhases',
      'activeIcoPhases',
      'totalIcoAllocations',
      'totalIcoContributions',
    ]

    icoCharts.value.forEach((chart, index) => {
      const key = dataKeys[index]
      if (icoData[key]) {
        chart.data = useSparklineConfiguration(
          undefined,
          'ico',
          chart.data.series[0].name,
          chart.iconColor,
          transformToCountsPerDay(icoData[key]),
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
        v-for="(chart, index) in icoCharts"
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
      <MashLottie
        category="cryptocurrency-4"
        url="legislation"
        class="max-w-lg"
      />
    </div>
  </div>
</template>
