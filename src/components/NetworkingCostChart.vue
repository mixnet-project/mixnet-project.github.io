<template>
  <el-card class="chart-card">
    <template #header>
      <div class="header-content">
        <h2>Networking Cost Analysis (Figure 11 in the technical paper)</h2>
        <p>
          We assume <strong>no oversubscription</strong> for the electrical
          interconnects.
        </p>
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
import { getCostForBandwidth, costCalculator } from "../utils/cost";
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

// Add state for tracking if calculation has been performed
const hasCalculated = ref(false);

// Props definition
const props = defineProps({
  costData: {
    type: Array,
    default: () => [],
  },
  clusterData: {
    type: Object,
    default: () => ({}),
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
      name: "Number of GPUs",
      nameLocation: "middle",
      nameGap: 20,
    },
    yAxis: {
      type: "value",
      name: "Networking Cost (Million $)",
      nameLocation: "middle",
      nameGap: 65,
    },
  });
}

function updateChart() {
  if (!chart || !props.costData) return;

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
      type: "solid",
    },
    // For TopoOpt, show only symbols without line
    showSymbol: true,
    showAllSymbol: true,
    // connectNulls: topo !== TOPOLOGY_TYPES.TOPO_OPT,
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

    const bandwidth = parseInt(selectedBandwidth.value);
    const costForRate = getCostForBandwidth(bandwidth, props.costData);
    const cost = costCalculator[topology.toLowerCase()](costForRate, scale);
    return cost ? cost / 1000000 : null;
  });
}

// Modify the calculation function
async function calculateAndDraw() {
  if (!props.costData) {
    ElMessage.error("Please fill in all required data before calculating");
    return;
  }

  try {
    calculating.value = true;

    // Initialize chart if not already done
    if (!chart) {
      initChart();
    }

    await updateChart();
    hasCalculated.value = true;
    ElMessage.success("Calculation completed successfully");
  } catch (error) {
    console.error("Error calculating networking cost:", error);
    ElMessage.error("Failed to calculate networking cost: " + error.message);
  } finally {
    calculating.value = false;
  }
}

// Initialize empty chart on mount
onMounted(() => {
  initChart();
  window.addEventListener("resize", handleResize);
});

// Only update on bandwidth change if we've calculated
watch(
  () => selectedBandwidth.value,
  () => {
    if (chart && props.costData) {
      updateChart();
    }
  }
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
  gap: 0.5rem;
}

.header-content h2 {
  margin: 0;
  color: var(--el-text-color-primary);
  border-bottom: 2px solid var(--el-border-color);
  padding-bottom: 0.5rem;
}

.header-content p {
  margin: 0;
  color: var(--el-text-color-secondary);
  margin-bottom: 0.5rem;
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
