export function collectData(data) {
  const { clusterScaleData, performanceData, costData } = data
  
  return {
    clusterScaleData: {
      servers: parseInt(clusterScaleData.servers),
      gpusPerServer: parseInt(clusterScaleData.gpusPerServer)
    },
    performanceData: performanceData.map(row => ({
      type: row.type,
      '40': parseFloat(row['40G']),
      '100': parseFloat(row['100G']),
      '200': parseFloat(row['200G']),
      '400': parseFloat(row['400G'])
    })),
    costData: costData.map(row => ({
      bandwidth: parseInt(row.bandwidth),
      transceiver: parseFloat(row.transceiver),
      nic: parseFloat(row.nic),
      electrical: parseFloat(row.electrical),
      optical: parseFloat(row.optical),
      panel: parseFloat(row.panel),
      fiber: parseFloat(row.fiber)
    }))
  }
}
