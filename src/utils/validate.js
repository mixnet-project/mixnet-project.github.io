export function validateClusterData(data) {
  if (!data.servers || !data.gpusPerServer) {
    throw new Error('Cluster scale data is incomplete')
  }
  if (data.servers <= 0 || data.gpusPerServer <= 0) {
    throw new Error('Server and GPU numbers must be positive')
  }
}

export function validatePerformanceData(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Performance data is empty')
  }
  
  const requiredTypes = ['Fat-tree', 'Rail-optimized', 'Rail-only', 'TopoOpt', 'MixNet']
  const missingTypes = requiredTypes.filter(type => 
    !data.some(row => row.type.toLowerCase() === type.toLowerCase())
  )
  
  if (missingTypes.length > 0) {
    throw new Error(`Missing required interconnect types: ${missingTypes.join(', ')}`)
  }

  data.forEach(row => {
    if (!row['40G'] || !row['100G'] || !row['200G'] || !row['400G']) {
      throw new Error(`Incomplete performance data for ${row.type}`)
    }
    if (row['40G'] < 0 || row['100G'] < 0 || row['200G'] < 0 || row['400G'] < 0) {
      throw new Error(`Invalid negative performance value for ${row.type}`)
    }
  })
}

export function validateCostData(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Cost data is empty')
  }

  const requiredRates = [40, 100, 200, 400]
  const missingRates = requiredRates.filter(rate => 
    !data.some(row => row.bandwidth === rate)
  )

  if (missingRates.length > 0) {
    throw new Error(`Missing cost data for rates: ${missingRates.join(', ')}G`)
  }

  data.forEach(row => {
    const fields = ['transceiver', 'nic', 'electrical', 'optical', 'panel', 'fiber']
    const missingFields = fields.filter(field => row[field] === null || row[field] === undefined)
    
    if (missingFields.length > 0) {
      throw new Error(`Missing cost values for ${row.bandwidth}G: ${missingFields.join(', ')}`)
    }

    fields.forEach(field => {
      if (row[field] < 0) {
        throw new Error(`Invalid negative cost value for ${field} at ${row.bandwidth}G`)
      }
    })
  })
} 