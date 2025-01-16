<template>
  <el-card class="chart-card">
    <template #header>
      <div class="header-content">
        <h2>Performance/Cost Analysis: Performance per dollar</h2>
        <div class="control-panel">
          <BandwidthSelector
            v-model="selectedBandwidth"
            :bandwidths="BANDWIDTHS"
          />
          <el-button
            type="primary"
            :loading="calculating"
            @click="calculateAndDraw"
          >
            {{ calculating ? "Calculating..." : "Calculate Performance/Cost" }}
          </el-button>
        </div>
      </div>
    </template>

    <div ref="chartContainer" class="chart-container"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import * as echarts from "echarts";
import {
  MODELS,
  BANDWIDTHS,
  TOPOLOGY_TYPES,
  TOPOLOGY_COLORS,
} from "../config/constants";
import { createChartOption } from "../utils/chartConfig";
import BandwidthSelector from "./BandwidthSelector.vue";
import { ElMessage } from "element-plus";
import { calculatePerfCost } from "../utils/plot";
import { validateCostData } from "../utils/validate";

// Chart initialization
const chartContainer = ref(null);
let chart = null;

// State management
const selectedBandwidth = ref("400G");
const topoTypes = [
  TOPOLOGY_TYPES.FAT_TREE,
  TOPOLOGY_TYPES.MIX_NET,
  TOPOLOGY_TYPES.RAIL_OPTIMIZED,
];

// Add calculating state
const calculating = ref(false);

// Props definition
const props = defineProps({
  perfData: {
    type: Array,
    default: () => [],
  },
  costData: {
    type: Array,
    default: () => [],
  },
  clusterData: {
    type: Object,
    default: () => ({}),
  },
  calculatedResults: {
    type: Object,
    default: () => ({}),
  },
});

// Define emits with proper validation
const emit = defineEmits({
  "update:calculatedResults": (value) => {
    return value !== undefined;
  },
});

// Chart functions
function initChart() {
  if (chart) {
    chart.dispose();
  }
  chart = echarts.init(chartContainer.value);

  // Set empty option to show the canvas
  chart.setOption({
    grid: {
      left: "10%",
      right: "4%",
      bottom: "15%",
      top: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      name: "Model",
      nameLocation: "middle",
      nameGap: 30,
      data: MODELS,
    },
    yAxis: {
      type: "value",
      name: "Normalized Perf. / Million Dollar",
      nameLocation: "middle",
      nameGap: 65,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      data: topoTypes,
      top: 0,
    },
  });
}

function updateChart() {
  if (!chart || !props.calculatedResults) return;

  const currentBandwidth = selectedBandwidth.value.replace("G", "");
  const series = topoTypes.map((topo) => ({
    name: topo,
    type: "bar",
    itemStyle: {
      color: TOPOLOGY_COLORS[topo],
    },
    data: MODELS.map((model) => {
      return props.calculatedResults[model]?.[topo]?.[currentBandwidth] || null;
    }),
  }));

  const option = createChartOption({
    series,
    models: MODELS,
    selectedBandwidth: selectedBandwidth.value,
    topoTypes,
  });

  chart.setOption(option);
}

// Calculate and draw function
async function calculateAndDraw() {
  if (!props.costData || !props.clusterData || !props.perfData) {
    ElMessage.error("Please fill in all required data before calculating");
    return;
  }

  try {
    calculating.value = true;
    validateCostData(props.costData);

    // Calculate results
    const results = calculatePerfCost(
      props.perfData,
      props.costData,
      props.clusterData
    );

    // Emit the results
    emit("update:calculatedResults", results);

    // Wait for next tick to ensure props are updated
    await nextTick();

    // Update the chart
    await updateChart();
    ElMessage.success("Calculation completed successfully");
  } catch (error) {
    console.error("Calculation error:", error);
    ElMessage({
      message: error.message,
      type: "error",
      duration: 5000,
      showClose: true,
    });
  } finally {
    calculating.value = false;
  }
}

// Initialize empty chart on mount
onMounted(() => {
  initChart();
  window.addEventListener("resize", handleResize);
});

// Only update on bandwidth change if we have calculated results
watch(
  () => selectedBandwidth.value,
  () => {
    if (chart && props.calculatedResults) {
      updateChart();
    }
  }
);

// Add watcher for calculatedResults
watch(
  () => props.calculatedResults,
  (newResults) => {
    if (chart && newResults) {
      updateChart();
    }
  },
  { deep: true }
);

onUnmounted(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
  window.removeEventListener("resize", handleResize);
});

function handleResize() {
  chart?.resize();
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

.control-panel {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .control-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .control-panel > * {
    width: 100%;
  }
}
</style>
