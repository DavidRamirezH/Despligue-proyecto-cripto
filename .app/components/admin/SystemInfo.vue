<script setup lang="ts">
const { getServerDetails } = useSystem()
const serverDetails = ref(null)
const serverUsage = ref(useServerUsage())
const ramUsage = ref(useRamUsage())
const storageUsage = ref(useStorageUsage())

onMounted(async () => {
  try {
    const response = await getServerDetails()
    serverDetails.value = response.data
  } catch (error) {
    console.error('Failed to fetch server details:', error)
    // Handle error appropriately
  }
})

const { primary, success, warning, danger } = useTailwindColors()

watchEffect(() => {
  const getUsageColor = (percentage) => {
    if (percentage < 50) return success.value
    if (percentage < 75) return warning.value
    return danger.value
  }
  const cpuUsage = Number(serverDetails.value?.cpu).toFixed(2) || 0
  serverUsage.value.options.colors = [getUsageColor(cpuUsage)]
  serverUsage.value.series = [cpuUsage]

  const ramUsagePercentage =
    Number(
      (parseFloat(serverDetails.value?.memory) /
        parseFloat(serverDetails.value?.totalMemory)) *
        100,
    ).toFixed(2) || 0
  ramUsage.value.options.colors = [getUsageColor(ramUsagePercentage)]
  ramUsage.value.series = [ramUsagePercentage]

  const storageUsagePercentage = serverDetails.value
    ? serverDetails.value.storageDetails.usagePercent
    : 0
  storageUsage.value.options.colors = [getUsageColor(storageUsagePercentage)]
  storageUsage.value.series = [storageUsagePercentage]
})

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

function useServerUsage() {
  const { primary, success, warning, danger } = useTailwindColors()
  const type = 'radialBar'
  const height = 225

  const options = {
    title: {
      text: '',
    },
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: [primary.value, success.value],
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--color-muted-400)',
            offsetY: 80,
          },
          value: {
            offsetY: 40,
            fontSize: '18px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: '500',
            color: undefined,
            formatter: function (val: number) {
              return val + '%'
            },
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
      },
    },
    stroke: {
      dashArray: 4,
    },
    labels: ['CPU'],
  }

  const series = [Number(serverDetails.value?.cpu) || 0]

  return {
    type,
    height,
    options,
    series,
  }
}

function useRamUsage() {
  const { primary, success, warning, danger } = useTailwindColors()
  const type = 'radialBar'
  const height = 225

  const options = {
    title: {
      text: '',
    },
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: [primary.value, success.value],
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--color-muted-400)',
            offsetY: 80,
          },
          value: {
            offsetY: 40,
            fontSize: '18px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: '500',
            color: undefined,
            formatter: function (val: number) {
              return val + '%'
            },
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
      },
    },
    stroke: {
      dashArray: 4,
    },
    labels: ['RAM'],
  }

  const series = [
    Number(
      (parseFloat(serverDetails.value?.memory) /
        parseFloat(serverDetails.value?.totalMemory)) *
        100,
    ).toFixed(2) || 0,
  ]

  return {
    type,
    height,
    options,
    series,
  }
}

function useStorageUsage() {
  const { primary, success, warning, danger } = useTailwindColors()
  const type = 'radialBar'
  const height = 225

  const options = {
    title: {
      text: '',
    },
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: [primary.value, success.value],
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--color-muted-400)',
            offsetY: 80,
          },
          value: {
            offsetY: 40,
            fontSize: '18px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: '500',
            color: undefined,
            formatter: function (val: number) {
              return val + '%'
            },
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
      },
    },
    stroke: {
      dashArray: 4,
    },
    labels: ['Storage'],
  }

  const series = [0]

  return {
    type,
    height,
    options,
    series,
  }
}
</script>

<template>
  <BaseCard class="container mx-auto p-6 bg-white dark:bg-gray-800">
    <h3 class="text-lg font-bold dark:text-white mb-6">System Information</h3>

    <div v-if="serverDetails" class="space-y-6">
      <!-- Charts Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="space-y-2">
          <AddonApexcharts v-bind="serverUsage" />
        </div>
        <div class="space-y-2">
          <AddonApexcharts v-bind="ramUsage" />
        </div>
        <div class="space-y-2">
          <AddonApexcharts v-bind="storageUsage" />
        </div>
      </div>

      <!-- Detailed Information Row -->
      <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p class="font-semibold dark:text-gray-400">System Hostname</p>
            <p>{{ serverDetails.hostname }}</p>
            <p class="font-semibold dark:text-gray-400">Operating System</p>
            <p>{{ serverDetails.os }}</p>
          </div>
          <div>
            <p class="font-semibold dark:text-gray-400">
              Processor Information
            </p>
            <p>{{ serverDetails.cpuDetails.model }}</p>
            <p>{{ serverDetails.cpuDetails.count }} Cores</p>
            <p>{{ serverDetails.cpuDetails.speed }} MHz</p>
          </div>
          <div>
            <p class="font-semibold dark:text-gray-400">Memory Information</p>
            <p>Total: {{ formatBytes(serverDetails.totalMemory) }}</p>
            <p>Used: {{ formatBytes(serverDetails.memory) }}</p>
          </div>
          <div>
            <p class="font-semibold dark:text-gray-400">Disk Information</p>
            <p>
              Total Disk Space:
              {{ formatBytes(serverDetails.storageDetails.totalSize) }}
            </p>
            <p>
              Used Disk Space:
              {{ formatBytes(serverDetails.storageDetails.usedSize) }}
            </p>
            <p>
              Available Disk Space:
              {{ formatBytes(serverDetails.storageDetails.availableSize) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 dark:text-gray-400">
      Loading system information...
    </div>
  </BaseCard>
</template>
