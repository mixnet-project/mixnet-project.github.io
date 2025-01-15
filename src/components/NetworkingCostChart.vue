<template>
  <el-card class="chart-card">
    <template #header>
      <div class="header-content">
        <h2>Networking Cost Analysis</h2>
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
            {{ calculating ? "Calculating..." : "Calculate Networking Cost" }}
          </el-button>
        </div>
      </div>
    </template>

    <div ref="chartContainer" class="chart-container"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as echarts from "echarts";
import {
  BANDWIDTHS,
  TOPOLOGY_TYPES,
  TOPOLOGY_STYLES,
} from "../config/constants";
import BandwidthSelector from "./BandwidthSelector.vue";
import { calculateNetworkingCost } from "../utils/cost";
import { ElMessage } from "element-plus";
import { createNetworkingCostOption } from "../utils/chartConfig";

// Chart initialization
const chartContainer = ref(null);
let chart = null;

// State management
const selectedBandwidth = ref("400G");
const topoTypes = [
  TOPOLOGY_TYPES.FAT_TREE,
  TOPOLOGY_TYPES.MIX_NET,
  TOPOLOGY_TYPES.RAIL_OPTIMIZED,
  TOPOLOGY_TYPES.TOPO_OPT,
  TOPOLOGY_TYPES.RAIL_ONLY,
];

// Add calculating state
const calculating = ref(false);

// Props definition
const props = defineProps({
  costData: {
    type: Array,
    required: true,
  },
  clusterData: {
    type: Object,
    required: true,
  },
});

// Chart functions
function initChart() {
  if (chart) {
    chart.dispose();
  }
  chart = echarts.init(chartContainer.value);
}

function updateChart() {
  if (!chart || !props.costData || !props.clusterData) return;

  const series = createSeries();
  const serverScales = generateServerScales();

  const option = createNetworkingCostOption({
    series,
    serverScales,
  });

  chart.setOption(option);
}

function createSeries() {
  return topoTypes.map((topo) => ({
    name: topo,
    type: "line",
    symbol: TOPOLOGY_STYLES[topo].marker,
    symbolSize: 12,
    itemStyle: {
      color: TOPOLOGY_STYLES[topo].color,
    },
    lineStyle: {
      width: 2,
      // For TopoOpt, don't show connecting lines
      type: topo === TOPOLOGY_TYPES.TOPO_OPT ? "none" : "solid",
    },
    data: generateCostData(topo),
  }));
}

function generateServerScales() {
  // Use fixed scale points
  return [128, 256, 512, 1024, 2048, 4096];
}

function generateCostData(topology) {
  const serverScales = generateServerScales();
  return serverScales.map((scale, index) => {
    // For TopoOpt, only show the first point (128 servers)
    if (topology === TOPOLOGY_TYPES.TOPO_OPT && index > 0) {
      return null;
    }

    const costResult = calculateNetworkingCost({
      clusterScaleData: {
        servers: scale,
        gpusPerServer: props.clusterData.gpusPerServer,
        oversubscription: props.clusterData.oversubscription || 1,
      },
      costData: props.costData,
      performanceData: [],
    });

    const bandwidth = parseInt(selectedBandwidth.value);
    const cost = costResult[topology.toLowerCase()]?.[bandwidth];
    return cost ? cost / 1000000 : null;
  });
}

// Modify the function to handle calculation
async function calculateAndDraw() {
  if (!props.costData || !props.clusterData) {
    ElMessage.error("Please fill in all required data before calculating");
    return;
  }

  if (!props.clusterData.gpusPerServer) {
    ElMessage.error("Please set the number of GPUs per server");
    return;
  }

  try {
    calculating.value = true;
    await updateChart();
    ElMessage.success("Calculation completed successfully");
  } catch (error) {
    console.error("Error calculating networking cost:", error);
    ElMessage.error("Failed to calculate networking cost: " + error.message);
  } finally {
    calculating.value = false;
  }
}

// Remove the automatic chart update on bandwidth change
watch(
  [() => props.costData, () => props.clusterData],
  () => {
    if (chart) {
      updateChart();
    }
  },
  { deep: true }
);

// Lifecycle hooks and watchers
watch(
  [
    () => selectedBandwidth.value,
    () => props.costData,
    () => props.clusterData,
  ],
  () => updateChart(),
  { deep: true }
);

onMounted(() => {
  initChart();
  updateChart();
  window.addEventListener("resize", handleResize);
});

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

/* Add responsive styles */
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
