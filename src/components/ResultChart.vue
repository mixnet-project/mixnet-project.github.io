<template>
  <el-card class="chart-card">
    <template #header>
      <div class="header-content">
        <h2>Performance/Cost Analysis: Performance per dollar</h2>
        <div class="bandwidth-selector">
          <div class="selector-label">Select Bandwidth:</div>
          <div class="bandwidth-options">
            <el-radio-group 
              v-model="selectedBandwidth" 
              @change="updateChart"
            >
              <el-radio-button 
                v-for="bw in bandwidths" 
                :key="bw" 
                :label="`${bw}G`"
              >
                {{ bw }}G
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
    </template>
    
    <div ref="chartContainer" class="chart-container"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const chartContainer = ref(null)
let chart = null

const selectedBandwidth = ref('400G')
const bandwidths = [100, 200, 400, 800]
const availableModels = [
  'Mixtral 8*22B',
  'Mixtral 8*7B',
  'Qwen-MoE',
  'Llama-MoE'
]

const topoTypes = ['Fat-tree', 'MixNet', 'Rail-optimized']
const topoColors = {
  'Fat-tree': '#5470c6',
  'MixNet': '#91cc75',
  'Rail-optimized': '#fac858'
}

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

function initChart() {
  if (chart) {
    chart.dispose()
  }
  chart = echarts.init(chartContainer.value)
}

function updateChart() {
  if (!chart || !props.calculatedResults) return

  const series = topoTypes.map(topo => ({
    name: topo,
    type: 'bar',
    itemStyle: {
      color: topoColors[topo]
    },
    data: availableModels.map(model => {
      return props.calculatedResults[model]?.[topo]?.[selectedBandwidth.value] || null
    })
  }))

  const option = {
    textStyle: {
      fontFamily: "'Open Sans', sans-serif"
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        let result = `Model: ${params[0].axisValue}<br/>`
        params.forEach(param => {
          if (param.value !== null) {
            result += `${param.seriesName}: ${param.value.toFixed(3)}<br/>`
          }
        })
        return result
      },
      textStyle: {
        fontFamily: "'Open Sans', sans-serif"
      }
    },
    legend: {
      data: topoTypes,
      top: 0,
      textStyle: {
        fontSize: 20,
        fontFamily: "'Open Sans', sans-serif"
      },
      itemGap: 30,
      padding: [5, 10]
    },
    grid: {
      left: '10%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: availableModels,
      nameLocation: 'middle',
      nameGap: 30,
      axisLabel: {
        interval: 0,
        fontSize: 22,
        fontFamily: "'Open Sans', sans-serif"
      }
    },
    yAxis: {
      type: 'value',
      name: 'Normalized Perf. / Million Dollar',
      nameLocation: 'middle',
      nameGap: 65,
      nameTextStyle: {
        fontSize: 22,
        padding: [0, 0, 0, 30],
        fontFamily: "'Open Sans', sans-serif"
      },
      axisLabel: {
        fontSize: 20,
        fontFamily: "'Open Sans', sans-serif"
      }
    },
    series
  }

  chart.setOption(option)
}

// Watch for changes in selected bandwidth or calculated results
watch(
  [() => selectedBandwidth.value, () => props.calculatedResults],
  () => {
    updateChart()
  },
  { deep: true }
)

onMounted(() => {
  initChart()
  updateChart()
  
  window.addEventListener('resize', () => {
    chart?.resize()
  })
})

onUnmounted(() => {
  if (chart) {
    chart.dispose()
    chart = null
  }
  window.removeEventListener('resize', () => {
    chart?.resize()
  })
})
</script>

<style scoped>
.chart-card {
  margin-bottom: 20px;
  font-family: 'Open Sans', sans-serif;
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

.bandwidth-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}

.selector-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.bandwidth-options {
  flex: 1;
}

.chart-container {
  height: 400px;
  width: 100%;
}

:deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

:deep(.el-radio-button__inner) {
  padding: 8px 16px;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .bandwidth-selector {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .bandwidth-options {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  :deep(.el-radio-group) {
    flex-wrap: nowrap;
  }
  
  .chart-container {
    height: 300px;
  }
}
</style>
