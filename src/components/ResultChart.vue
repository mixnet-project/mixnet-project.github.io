<template>
  <el-card class="chart-card">
    <template #header>
      <div class="header-content">
        <h2>Performance/Cost Analysis: Performance per dollar</h2>
        <BandwidthSelector 
          v-model="selectedBandwidth"
          :bandwidths="BANDWIDTHS"
          @change="updateChart"
        />
      </div>
    </template>
    
    <div ref="chartContainer" class="chart-container"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { MODELS, BANDWIDTHS, TOPOLOGY_TYPES, TOPOLOGY_COLORS } from '../config/constants'
import { createChartOption } from '../utils/chartConfig'
import BandwidthSelector from './BandwidthSelector.vue'

// Chart initialization
const chartContainer = ref(null)
let chart = null

// State management
const selectedBandwidth = ref('400G')
const topoTypes = [
  TOPOLOGY_TYPES.FAT_TREE,
  TOPOLOGY_TYPES.MIX_NET,
  TOPOLOGY_TYPES.RAIL_OPTIMIZED
]

// Props definition
const props = defineProps({
  perfData: {
    type: Array,
    required: true
  },
  costData: {
    type: Array,
    required: true
  },
  clusterData: {
    type: Object,
    required: true
  },
  calculatedResults: {
    type: Object,
    required: true
  }
})

// Chart initialization and update functions
function initChart() {
  if (chart) {
    chart.dispose()
  }
  chart = echarts.init(chartContainer.value)
}

function updateChart() {
  if (!chart || !props.calculatedResults) return

  const series = createSeries()
  const option = createChartOption({
    series,
    models: MODELS,
    selectedBandwidth: selectedBandwidth.value,
    topoTypes
  })

  chart.setOption(option)
}

function createSeries() {
  return topoTypes.map(topo => ({
    name: topo,
    type: 'bar',
    itemStyle: {
      color: TOPOLOGY_COLORS[topo]
    },
    data: MODELS.map(model => {
      return props.calculatedResults[model]?.[topo]?.[selectedBandwidth.value] || null
    })
  }))
}

// Lifecycle hooks and watchers
watch(
  [() => selectedBandwidth.value, () => props.calculatedResults],
  () => updateChart(),
  { deep: true }
)

onMounted(() => {
  initChart()
  updateChart()
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (chart) {
    chart.dispose()
    chart = null
  }
  window.removeEventListener('resize', handleResize)
})

// Event handlers
function handleResize() {
  chart?.resize()
}
</script>

<style scoped>
.chart-card {
  margin-bottom: 20px;
  font-family: var(--body-font);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-content h2 {
  margin: 0;
  color: var(--el-text-color-primary);
  border-bottom: 2px solid var(--el-border-color);
  padding-bottom: 0.5rem;
}

.chart-container {
  height: 400px;
  width: 100%;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }
}
</style>
