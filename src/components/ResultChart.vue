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
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";

const networkColors = {
  "Fat-tree": "#67C23A",
  MixNet: "#F56C6C",
  "Rail-optimized": "#409EFF",
  "Rail-only": "#E6A23C",
  TopoOpt: "#909399",
};

const props = defineProps({
  perfCostData: {
    type: Object,
    default: null,
  },
});

const chartCanvas = ref(null);
let chart = null;

const createChart = (data) => {
  if (!chartCanvas.value) {
    console.warn("Canvas element not ready");
    return;
  }

  if (chart) {
    chart.destroy();
  }

  console.log("Creating chart with data:", data);
  const ctx = chartCanvas.value.getContext("2d");
  const rates = ["40", "100", "200", "400"];
  const datasets = [];

  for (const type in data) {
    const points = data[type];
    datasets.push({
      label: type,
      data: points.map((point) => point.performance),
      borderColor: networkColors[type],
      fill: false,
      tension: 0.1,
    });
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: rates,
      datasets: datasets.map(dataset => ({
        ...dataset,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          padding: 20,
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              family: 'var(--body-font)',
              size: 13,
            },
            generateLabels: (chart) => {
              const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
              return labels.map(label => ({
                ...label,
                lineWidth: 1,
                strokeStyle: networkColors[label.text],
                fillStyle: networkColors[label.text],
              }));
            }
          }
        },
        title: {
          display: true,
          text: 'Performance/Cost vs Rate',
          padding: {
            top: 10,
            bottom: 20
          },
          font: {
            family: 'var(--heading-font)',
            size: 16,
            weight: '600'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#2c3e50',
          bodyColor: '#2c3e50',
          borderColor: '#e4e7ed',
          borderWidth: 1,
          padding: 10,
          bodyFont: {
            family: 'var(--body-font)',
            size: 13
          },
          titleFont: {
            family: 'var(--heading-font)',
            size: 14,
            weight: '600'
          },
          callbacks: {
            label: (context) => {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Rate (Gbps)",
            padding: { top: 10 },
            font: {
              family: 'var(--body-font)',
              size: 13,
              weight: '500'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          }
        },
        y: {
          title: {
            display: true,
            text: "Performance/Cost",
            padding: { bottom: 10 },
            font: {
              family: 'var(--body-font)',
              size: 13,
              weight: '500'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          }
        },
      },
      animation: {
        duration: 750,
        easing: 'easeOutQuart'
      }
    },
  });
};

watch(
  () => props.perfCostData,
  (newData) => {
    if (newData && chartCanvas.value) {
      console.log("Watch triggered with data:", newData);
      createChart(newData);
    }
  },
  { deep: true }
);

onMounted(() => {
  console.log("Component mounted, canvas:", chartCanvas.value);
  console.log("Initial perfCostData:", props.perfCostData);
  if (props.perfCostData && chartCanvas.value) {
    createChart(props.perfCostData);
  }
});
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
