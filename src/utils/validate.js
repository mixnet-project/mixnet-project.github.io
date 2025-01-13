// Validate performance data structure
export function validatePerformanceData(data) {
  if (!Array.isArray(data)) {
    throw new Error('Performance data must be an array')
  }

  if (data.length === 0) {
    throw new Error('Performance data cannot be empty')
  }

  // Check each row has required topology types
  const requiredTypes = ['Fat-tree', 'MixNet', 'Rail-optimized']
  const types = data.map(row => row.type)
  
  requiredTypes.forEach(type => {
    if (!types.includes(type)) {
      throw new Error(`Missing required interconnect type: ${type}`)
    }
  })

  console.log('Performance data:', data)

  // Check each row has required bandwidth data
  const requiredBandwidths = [100, 200, 400, 800]
  
  data.forEach(row => {
    requiredBandwidths.forEach(bw => {
      if (typeof row[bw] !== 'number') {
        throw new Error(`Missing or invalid ${bw} data for ${row.type}`)
      }
    })
  })
}

// Validate cost data structure
export function validateCostData(data) {
  if (!Array.isArray(data)) {
    throw new Error('Cost data must be an array')
  }

  if (data.length === 0) {
    throw new Error('Cost data cannot be empty')
  }

  // Check required bandwidths are present
  const requiredBandwidths = [100, 200, 400, 800]
  console.log('Cost data:', data)
  const bandwidths = data.map(row => row.bandwidth)
  
  requiredBandwidths.forEach(bw => {
    if (!bandwidths.includes(bw)) {
      throw new Error(`Missing required bandwidth: ${bw}G`)
    }
  })

  // Check required cost fields
  const requiredFields = [
    'bandwidth',
    'transceiver',
    'nic',
    'electrical',
    'optical',
    'panel',
    'fiber'
  ]

  data.forEach(row => {
    requiredFields.forEach(field => {
      if (typeof row[field] !== 'number') {
        throw new Error(`Missing or invalid ${field} data for ${row.bandwidth}G`)
      }
    })
  })
} 