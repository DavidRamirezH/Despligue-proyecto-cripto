<script setup lang="ts">
definePageMeta({
  permissions: ['Access Mailwizard Management'],
  title: 'Mailwizard Management',
})

const { getAdminMailwizardAnalytics } = useMailwizard()
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

const mailWizardCharts = ref([
  createChartConfig('Total Campaigns', 'material-symbols:campaign', 'primary'),
  createChartConfig('Active Campaigns', 'material-symbols:campaign', 'success'),
  createChartConfig('Total Templates', 'tabler:template', 'info'),
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
  const response = await getAdminMailwizardAnalytics()
  if (response.status) {
    const mailWizardData = response.data

    const dataKeys = [
      'totalMailWizardCampaigns',
      'activeMailWizardCampaigns',
      'totalMailWizardTemplates',
    ]

    mailWizardCharts.value.forEach((chart, index) => {
      const key = dataKeys[index]
      if (mailWizardData[key]) {
        chart.data = useSparklineConfiguration(
          undefined,
          'mail-wizard',
          chart.data.series[0].name,
          chart.iconColor,
          transformToCountsPerDay(mailWizardData[key]),
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
        v-for="(chart, index) in mailWizardCharts"
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
        category="communications"
        url="social-media"
        max="2"
        class="max-w-lg"
      />
    </div>
  </div>
</template>
