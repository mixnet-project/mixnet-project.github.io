function getCostDataForRate(rate, costDataMap) {
  if (!costDataMap[rate]) {
    throw new Error(`Cost data for rate ${rate} not found.`);
  }
  return costDataMap[rate];
}

var seed = 1234;
function random() {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function calculate_fiber_cost(num_fibers, fiber_cost_per_meter) {
  let total_cost = 0;
  for (let i = 0; i < num_fibers; i++) {
    let fiber_length = 500;
    total_cost += fiber_length * fiber_cost_per_meter;
  }
  return total_cost;
}

function calculateFattreeCost(
  costForRate,
  numServers,
  numNicsPerServer = 8,
  overSubRatio = 1.0
) {
  const total_nics = numServers * numNicsPerServer;

  const total_edge_downlink_ports = total_nics;
  const total_edge_uplink_ports = total_edge_downlink_ports * overSubRatio;

  const total_aggr_ports = total_edge_uplink_ports * 2;
  const total_core_ports = total_aggr_ports;
  const total_switch_ports =
    total_edge_downlink_ports +
    total_edge_uplink_ports +
    total_aggr_ports +
    total_core_ports;
  const total_optical_modules = total_switch_ports + total_nics;
  const total_fibers = Math.ceil(total_optical_modules / 2);

  const totalCost =
    total_nics * parseFloat(costForRate.nic) +
    total_optical_modules * parseFloat(costForRate.transceiver) +
    total_switch_ports * parseFloat(costForRate.electrical_switch_port) +
    calculate_fiber_cost(total_fibers, parseFloat(costForRate.optical_fiber));

  return totalCost;
}

function calculateRailOptimizedCost(
  costForRate,
  numServers,
  numNicsPerServer = 8,
  overSubRatio = 1.0
) {
  return calculateFattreeCost(
    costForRate,
    numServers,
    numNicsPerServer,
    overSubRatio
  );
}

function calculateTopooptCost(costForRate, numServers, numNicsPerServer = 8) {
  const totalNics = numServers * numNicsPerServer;
  const totalTransceivers = totalNics;
  const totalPatchPanelPorts = totalNics;
  const totalFibers = totalTransceivers;

  let totalCost =
    totalNics * parseFloat(costForRate.nic) +
    totalTransceivers * parseFloat(costForRate.transceiver) +
    totalPatchPanelPorts * parseFloat(costForRate.patch_panel_port);
  totalCost += calculate_fiber_cost(
    totalFibers,
    parseFloat(costForRate.optical_fiber)
  );

  return totalCost;
}

function calculateRailOnlyCost(
  costForRate,
  numServers,
  numNicsPerServer = 8,
  overSubRatio = 1.0
) {
  const total_nics = numServers * numNicsPerServer;

  const total_edge_downlink_ports = total_nics;
  const total_edge_uplink_ports = total_edge_downlink_ports * overSubRatio;
  const total_aggr_ports = total_edge_uplink_ports * 2;
  const total_switch_ports =
    total_edge_downlink_ports + total_edge_uplink_ports + total_aggr_ports;
  const total_optical_modules = total_switch_ports + total_nics;
  const total_fibers = Math.ceil(total_optical_modules / 2);

  const totalCost =
    total_nics * parseFloat(costForRate.nic) +
    total_optical_modules * parseFloat(costForRate.transceiver) +
    total_switch_ports * parseFloat(costForRate.electrical_switch_port) +
    calculate_fiber_cost(total_fibers, parseFloat(costForRate.optical_fiber));

  return totalCost;
}

function calculateMixNetCost(
  costForRate,
  numServers,
  numNicsPerServer = 8,
  optical_degree = 6
) {
  const total_nics = numServers * numNicsPerServer;
  const eth_edge_switch_downstream_ports =
    numServers * (numNicsPerServer - optical_degree);
  const eth_edge_switch_upstream_ports = eth_edge_switch_downstream_ports;
  const eth_agg_switch_ports = eth_edge_switch_upstream_ports * 2;
  const eth_core_switch_ports = eth_agg_switch_ports;
  const num_eth_switch_transceivers =
    eth_edge_switch_downstream_ports +
    eth_edge_switch_upstream_ports +
    eth_agg_switch_ports +
    eth_core_switch_ports;
  const num_eth_fibers = Math.ceil(num_eth_switch_transceivers / 2);

  const num_ocs_ports = total_nics - eth_edge_switch_downstream_ports;
  const num_ocs_fibers = num_ocs_ports;

  const total_transceivers = num_eth_switch_transceivers + total_nics;
  const total_fibers = num_eth_fibers + num_ocs_fibers;

  const cost =
    total_nics * parseFloat(costForRate.nic) +
    total_transceivers * parseFloat(costForRate.transceiver) +
    total_nics * parseFloat(costForRate.optical_switch_port) +
    calculate_fiber_cost(total_fibers, parseFloat(costForRate.optical_fiber));
  return cost;
}

export function calculateNetworkingCost(data) {
  const { clusterScaleData, performanceData, costData } = data;

  if (!clusterScaleData || !performanceData || !costData) {
    console.error("Missing required data");
    return null;
  }

  const numServers = clusterScaleData.servers;
  const numNicsPerServer = clusterScaleData.gpusPerServer;
  const rates = costData.map((item) => item.bandwidth);

  const total_cost = {};

  for (let i = 0; i < rates.length; i++) {
    const rate = rates[i];
    const costForRate = getCostForBandwidth(rate, costData);

    const fattreeCost = calculateFattreeCost(
      costForRate,
      numServers,
      numNicsPerServer,
      1.0
    );
    const railOptimizedCost = calculateRailOptimizedCost(
      costForRate,
      numServers,
      numNicsPerServer,
      1.0
    );
    const topooptCost = calculateTopooptCost(
      costForRate,
      numServers,
      numNicsPerServer
    );
    const railOnlyCost = calculateRailOnlyCost(
      costForRate,
      numServers,
      numNicsPerServer,
      1.0
    );
    const mixNetCost = calculateMixNetCost(
      costForRate,
      numServers,
      numNicsPerServer,
      6
    );

    if (!total_cost["fat-tree"]) total_cost["fat-tree"] = {};
    if (!total_cost["rail-optimized"]) total_cost["rail-optimized"] = {};
    if (!total_cost["topoopt"]) total_cost["topoopt"] = {};
    if (!total_cost["rail-only"]) total_cost["rail-only"] = {};
    if (!total_cost["mixnet"]) total_cost["mixnet"] = {};

    total_cost["fat-tree"][rate] = fattreeCost;
    total_cost["rail-optimized"][rate] = railOptimizedCost;
    total_cost["topoopt"][rate] = topooptCost;
    total_cost["rail-only"][rate] = railOnlyCost;
    total_cost["mixnet"][rate] = mixNetCost;
  }

  return total_cost;
}

// Helper function to get cost for specific bandwidth
export function getCostForBandwidth(bandwidth, costData) {
  // now this is a list
  const costs = costData.find((item) => item.bandwidth === bandwidth);
  if (!costs) {
    console.error(`No cost data found for bandwidth ${bandwidth}`);
    return null;
  }
  return {
    transceiver: costs.transceiver,
    nic: costs.nic,
    electrical_switch_port: costs.electrical,
    optical_switch_port: costs.optical,
    patch_panel_port: costs.panel,
    optical_fiber: costs.fiber,
  };
}

// define a array to store the function to calculate the cost
export const costCalculator = {
  "fat-tree": calculateFattreeCost,
  "rail-optimized": calculateRailOptimizedCost,
  topoopt: calculateTopooptCost,
  "rail-only": calculateRailOnlyCost,
  mixnet: calculateMixNetCost,
};
