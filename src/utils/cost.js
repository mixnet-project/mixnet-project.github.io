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

function calculateFattreeCost(numServers, numNicsPerServer = 8, overSubRatio = 1.0, costForRate) {
  const total_nics = numServers * numNicsPerServer;

  const total_edge_downlink_ports = total_nics;
  const total_edge_uplink_ports = total_edge_downlink_ports * overSubRatio;

  const total_aggr_ports = total_edge_uplink_ports * 2;
  const total_core_ports = total_aggr_ports;
  const total_switch_ports = total_edge_downlink_ports + total_edge_uplink_ports + total_aggr_ports + total_core_ports;
  const total_optical_modules = total_switch_ports + total_nics;
  const total_fibers = Math.ceil(total_optical_modules / 2);

  const totalCost =
    total_nics * parseFloat(costForRate.nic) +
    total_optical_modules * parseFloat(costForRate.transceiver) +
    total_switch_ports * parseFloat(costForRate.electrical_switch_port) +
    calculate_fiber_cost(total_fibers, parseFloat(costForRate.optical_fiber));

  return totalCost;
}

function calculateRailOptimizedCost(numServers, numNicsPerServer = 8, overSubRatio = 1.0, costForRate) {
  return calculateFattreeCost(numServers, numNicsPerServer, overSubRatio, costForRate);
}

function calculateTopooptCost(numServers, numNicsPerServer = 8, costForRate) {
  const totalNics = numServers * numNicsPerServer;
  const totalTransceivers = totalNics;
  const totalPatchPanelPorts = totalNics;
  const totalFibers = totalTransceivers;

  let totalCost =
    totalNics * parseFloat(costForRate.nic) +
    totalTransceivers * parseFloat(costForRate.transceiver) +
    totalPatchPanelPorts * parseFloat(costForRate.optical_patch_panel_port);
  totalCost += calculate_fiber_cost(totalFibers, parseFloat(costForRate.optical_fiber));

  return totalCost;
}

function calculateRailOnlyCost(numServers, numNicsPerServer = 8, overSubRatio = 1.0, costForRate) {
  const total_nics = numServers * numNicsPerServer;

  const total_edge_downlink_ports = total_nics;
  const total_edge_uplink_ports = total_edge_downlink_ports * overSubRatio;
  const total_aggr_ports = total_edge_uplink_ports * 2;
  const total_switch_ports = total_edge_downlink_ports + total_edge_uplink_ports + total_aggr_ports;
  const total_optical_modules = total_switch_ports + total_nics;
  const total_fibers = Math.ceil(total_optical_modules / 2);

  const totalCost =
    total_nics * parseFloat(costForRate.nic) +
    total_optical_modules * parseFloat(costForRate.transceiver) +
    total_switch_ports * parseFloat(costForRate.electrical_switch_port) +
    calculate_fiber_cost(total_fibers, parseFloat(costForRate.optical_fiber));

  return totalCost;
}

function calculateMixNetCost(numServers, numNicsPerServer = 8, optical_degree = 6, costForRate) {
  const total_nics = numServers * numNicsPerServer;
  const eth_edge_switch_downstream_ports = numServers * (numNicsPerServer - optical_degree);
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
  
  // 检查数据结构是否正确
  if (!clusterScaleData || !performanceData || !costData) {
    console.error('Missing required data');
    return null;
  }

  // 将 costData 数组转换为原来的对象格式
  const costDataMap = {};
  costData.forEach(row => {
    costDataMap[row.bandwidth] = {
      transceiver: row.transceiver,
      nic: row.nic,
      electrical_switch_port: row.electrical,
      optical_switch_port: row.optical,
      optical_patch_panel_port: row.panel,
      optical_fiber: row.fiber
    };
  });

  const numServers = clusterScaleData.servers;
  const numNicsPerServer = clusterScaleData.gpusPerServer;
  const rates = costData.map(row => row.bandwidth.toString());

  const total_cost = {};
  
  for (let i = 0; i < rates.length; i++) {
    const rate = rates[i];
    const costForRate = getCostDataForRate(rate, costDataMap);

    const fattreeCost = calculateFattreeCost(numServers, numNicsPerServer, 1.0, costForRate);
    const railOptimizedCost = calculateRailOptimizedCost(numServers, numNicsPerServer, 1.0, costForRate);
    const topooptCost = calculateTopooptCost(numServers, numNicsPerServer, costForRate);
    const railOnlyCost = calculateRailOnlyCost(numServers, numNicsPerServer, 1.0, costForRate);
    const mixNetCost = calculateMixNetCost(numServers, numNicsPerServer, 6, costForRate);

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