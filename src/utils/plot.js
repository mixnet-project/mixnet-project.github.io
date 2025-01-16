import { calculateNetworkingCost } from "./cost";

// Calculate performance/cost ratio for different models and topologies
export function calculatePerfCost(performanceData, costData, clusterScaleData) {
  // Get available bandwidths from cost data
  const bandwidths = costData.map((row) => row.bandwidth);

  // Calculate networking cost using the proper function
  const networkingCost = calculateNetworkingCost({
    clusterScaleData: clusterScaleData,
    performanceData: performanceData,
    costData: costData,
  });

  const results = {};
  const modelGroups = groupByModel(performanceData);

  Object.entries(modelGroups).forEach(([model, modelData]) => {
    results[model] = {};

    // Group data by topology type
    const topoGroups = {};
    modelData.forEach((item) => {
      if (!topoGroups[item.type]) {
        topoGroups[item.type] = [];
      }
      topoGroups[item.type].push(item);
    });

    // Calculate perf/cost for each topology
    Object.entries(topoGroups).forEach(([topo, topoData]) => {
      results[model][topo] = {};

      bandwidths.forEach((bw) => {
        const bandwidth = parseInt(bw);
        const perfItem = topoData.find((item) => item.Bandwidth === bandwidth);

        if (
          perfItem?.value &&
          networkingCost[topo.toLowerCase()]?.[bandwidth]
        ) {
          const perf = 1.0 / perfItem.value;
          const cost = networkingCost[topo.toLowerCase()][bandwidth];
          results[model][topo][bw] = perf / (cost / 1000000);
        }
      });
    });
  });

  return results;
}

// Helper function to group performance data by model
function groupByModel(performanceData) {
  return performanceData.reduce((acc, row) => {
    const model = row.Model;
    if (!acc[model]) {
      acc[model] = [];
    }
    acc[model].push(row);
    return acc;
  }, {});
}

// Optional: Add helper function to get available bandwidths
export function getAvailableBandwidths(costData) {
  return costData
    .map((row) => `${row.bandwidth}G`)
    .sort((a, b) => {
      return parseInt(a) - parseInt(b);
    });
}
