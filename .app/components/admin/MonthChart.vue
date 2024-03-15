<template>
  <BaseCard class="pt-4">
    <AddonApexcharts
      v-bind="chartData"
      :key="chartKey"
      :icon="icon"
      :icon-color="iconColor"
    />
  </BaseCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  chartData: Object,
  icon: String,
  iconColor: String,
})

let chartKey = ref(0)

const reinitializeChart = () => {
  chartKey.value++
}

onMounted(() => {
  window.addEventListener('resize', reinitializeChart)
})

onUnmounted(() => {
  window.removeEventListener('resize', reinitializeChart)
})

watch(
  () => props.chartData,
  () => {
    reinitializeChart()
  },
)
</script>
