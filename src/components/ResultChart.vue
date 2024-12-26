<template>
  <el-card class="chart-container">
    <template #header>
      <h2>Performance/Cost Chart</h2>
    </template>
    
    <div class="canvas-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  perfCostData: {
    type: Object,
    default: null
  }
})

const chartCanvas = ref(null)
let chart = null

const createChart = (data) => {
  if (!chartCanvas.value) {
    console.warn('Canvas element not ready')
    return
  }

  if (chart) {
    chart.destroy()
  }

  console.log('Creating chart with data:', data)
  const ctx = chartCanvas.value.getContext('2d')
  const rates = ['40', '100', '200', '400']
  const datasets = []
  
  // 为每种互连方式创建一个数据集
  for (const type in data) {
    const points = data[type]
    datasets.push({
      label: type,
      data: points.map(point => point.performance),
      borderColor: getRandomColor(),
      fill: false,
      tension: 0.1
    })
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: rates,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Rate (Gbps)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Performance/Cost'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Performance/Cost vs Rate'
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`
            }
          }
        }
      }
    }
  })
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

watch(() => props.perfCostData, (newData) => {
  if (newData && chartCanvas.value) {
    console.log('Watch triggered with data:', newData)
    createChart(newData)
  }
}, { deep: true })

onMounted(() => {
  console.log('Component mounted, canvas:', chartCanvas.value)
  console.log('Initial perfCostData:', props.perfCostData)
  if (props.perfCostData && chartCanvas.value) {
    createChart(props.perfCostData)
  }
})
</script>

<style scoped>
.chart-container {
  margin-bottom: 20px;
}

.canvas-container {
  position: relative;
  height: 400px;
  width: 100%;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>
