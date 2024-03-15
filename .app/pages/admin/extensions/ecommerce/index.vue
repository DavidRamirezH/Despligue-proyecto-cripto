<script setup lang="ts">
definePageMeta({
  permissions: ['Access Ecommerce Management'],
  title: 'Ecommerce Management',
})
const { getAdminEcommerceAnalytics } = useEcommerce()
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

const ecommerceCharts = ref([
  createChartConfig('Total Products', 'fluent-mdl2:product-variant', 'primary'),
  createChartConfig('Active Products', 'fluent-mdl2:product', 'success'),
  createChartConfig('Total Orders', 'gridicons:product-external', 'info'),
  createChartConfig('Completed Orders', 'fluent-mdl2:product-list', 'warning'),
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
  const response = await getAdminEcommerceAnalytics()
  if (response.status) {
    const ecommerceData = response.data

    const dataKeys = [
      'totalEcommerceProducts',
      'activeEcommerceProducts',
      'totalEcommerceOrders',
      'completedEcommerceOrders',
    ]

    ecommerceCharts.value.forEach((chart, index) => {
      const key = dataKeys[index]
      if (ecommerceData[key]) {
        chart.data = useSparklineConfiguration(
          undefined,
          'ecommerce',
          chart.data.series[0].name,
          chart.iconColor,
          transformToCountsPerDay(ecommerceData[key]),
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
        v-for="(chart, index) in ecommerceCharts"
        :key="index"
      >
        <AdminMonthChart
          :chartData="chart.data"
          :icon="chart.icon"
          :icon-color="chart.iconColor"
        />
      </div>
    </div>
    <div class="flex items-center justify-center mt-10">
      <MashLottie
        category="ecommerce"
        url="cargo-protection"
        max="2"
        class="max-w-lg"
      />
    </div>
  </div>
</template>
