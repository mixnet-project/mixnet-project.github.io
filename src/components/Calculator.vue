<template>
  <div>
    <el-menu 
      :router="true" 
      mode="horizontal" 
      class="nav-menu"
    >
      <el-menu-item index="/">
        <el-icon><ArrowLeft /></el-icon>
        Back to Home
      </el-menu-item>
    </el-menu>

    <div class="container">
      <h1>Performance-Cost Calculator</h1>
      
      <!-- Cluster Scale Input -->
      <ClusterScale @update:data="updateClusterData" />

       <!-- Cost Data Input -->
       <CostTable @update:data="updateCostData" />

      <!-- Performance Data Input -->
      <PerformanceTable 
        ref="perfTableRef"
        @update:data="updatePerformanceData" 
      />
      
      <!-- Action Buttons -->
      <div class="button-container">
        <el-button 
          type="primary" 
          :loading="calculating"
          @click="calculateResults"
        >
          {{ calculating ? 'Calculating...' : 'Calculate Performance/Cost' }}
        </el-button>
      </div>
      
      <!-- Performance/Cost Chart -->
      <ResultChart 
        v-if="perfCostData"
        :perf-data="performanceData"
        :cost-data="costData"
        :cluster-data="clusterData"
        :calculated-results="perfCostData"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import ClusterScale from './ClusterScale.vue'
import PerformanceTable from './PerformanceTable.vue'
import CostTable from './CostTable.vue'
import ResultChart from './ResultChart.vue'
import { calculatePerfCost } from '../utils/plot'
import { ElMessage } from 'element-plus'
import { validatePerformanceData, validateCostData } from '../utils/validate'

// Core configuration
const defaultBandwidths = ['100G', '200G', '400G', '800G']

// Topology configurations
const topologyConfigs = {
  fattree: {
    label: 'Fat-tree',
    color: '#4c72b0'
  },
  mixnet: {
    label: 'MixNet', 
    color: '#70ad47'
  }
}

// Models list
const modelsList = [
  'Mixtral 8x22B',
  'Mixtral 8x7B', 
  'Qwen-MoE',
  'Llama-MoE'
]

// Reactive state for data management
const clusterData = ref(null)
const performanceData = ref(null) 
const costData = ref(null)
const results = ref(null)
const perfCostData = ref(null)
const calculating = ref(false)
const perfData = ref(null)

const selectedBandwidth = ref('400G')
const selectedModel = ref('Mixtral 8x22B')

const perfTableRef = ref(null)

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
  if (!costData.value) {
    ElMessage.error('Please fill in all required data before calculating')
    return
  }

  try {
    calculating.value = true
    
    // 使用 perfTableRef 中的 perfData
    const allPerfData = perfTableRef.value.perfData
    console.log('All performance data when calculate:', allPerfData)
    
    // validatePerformanceData(formattedPerfData)
    validateCostData(costData.value)
    
    // Calculate results using all performance data
    perfCostData.value = calculatePerfCost(allPerfData, costData.value, clusterData.value)
    console.log('Calculated perf/cost data:', perfCostData.value)
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

// Function to get available topologies from performance data
const getAvailableTopologies = () => {
  if (!performanceData.value) return []
  return performanceData.value.map(row => row.type)
}
</script>

<style scoped>
.nav-menu {
  padding: 0 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

h1 {
  background: linear-gradient(45deg, var(--primary-color), #36cfc9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 30px;
}

.button-container {
  margin: 20px 0;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.el-card {
  margin-bottom: 20px;
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

  .button-container {
    flex-direction: column;
  }
}
</style> 