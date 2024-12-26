<template>
  <div class="container">
    <h1>Performance/Cost Calculator - Reconfigurable optical interconnects</h1>
    
    <!-- Cluster Scale Input -->
    <ClusterScale @update:data="updateClusterData" />
    
    <!-- Performance Data Input -->
    <PerformanceTable @update:data="updatePerformanceData" />
    
    <!-- Cost Data Input -->
    <CostTable @update:data="updateCostData" />
    
    <!-- Action Buttons -->
    <div class="button-container">
      <el-button 
        type="primary" 
        :loading="calculating"
        @click="calculateResults"
      >
        {{ calculating ? 'Calculating...' : 'Calculate Networking Cost' }}
      </el-button>
      <el-button 
        type="success" 
        :disabled="!results"
        @click="exportResults"
      >
        Export Results
      </el-button>
    </div>
    
    <!-- Results Table -->
    <ResultTable :results="results" />
    
    <!-- Performance/Cost Chart -->
    <ResultChart :perf-cost-data="perfCostData" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ClusterScale from './ClusterScale.vue'
import PerformanceTable from './PerformanceTable.vue'
import CostTable from './CostTable.vue'
import ResultTable from './ResultTable.vue'
import ResultChart from './ResultChart.vue'
import { calculateNetworkingCost } from '../utils/cost'
import { calculatePerfCost } from '../utils/plot'
import { ElMessage } from 'element-plus'
import { validateClusterData, validatePerformanceData, validateCostData } from '../utils/validate'

const clusterData = ref(null)
const performanceData = ref(null)
const costData = ref(null)
const results = ref(null)
const perfCostData = ref(null)
const calculating = ref(false)

const updateClusterData = (data) => {
  clusterData.value = data
  console.log('Cluster data updated:', data)
}

const updatePerformanceData = (data) => {
  performanceData.value = data
  console.log('Performance data updated:', data)
}

const updateCostData = (data) => {
  costData.value = data
  console.log('Cost data updated:', data)
}

const calculateResults = async () => {
  if (!clusterData.value || !performanceData.value || !costData.value) {
    ElMessage.error('Please fill in all required data before calculating')
    return
  }

  try {
    calculating.value = true
    validateClusterData(clusterData.value)
    validatePerformanceData(performanceData.value)
    validateCostData(costData.value)

    const data = {
      clusterScaleData: clusterData.value,
      performanceData: performanceData.value,
      costData: costData.value
    }
    
    results.value = calculateNetworkingCost(data)
    perfCostData.value = calculatePerfCost(performanceData.value, results.value)
    ElMessage.success('Calculation completed successfully')
  } catch (error) {
    console.error('Calculation error:', error)
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5000,
      showClose: true
    })
  } finally {
    calculating.value = false
  }
}

const exportResults = () => {
  const data = {
    clusterScale: clusterData.value,
    performance: performanceData.value,
    cost: costData.value,
    results: results.value,
    perfCost: perfCostData.value
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'network-cost-results.json'
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button-container {
  margin: 20px 0;
  text-align: center;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  h1 {
    font-size: 20px;
  }

  .el-table {
    width: 100%;
    overflow-x: auto;
  }
}
</style> 