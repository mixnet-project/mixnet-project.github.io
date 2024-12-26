<template>
  <el-card class="performance-table">
    <template #header>
      <h2>Performance Table (Normalized Performance)</h2>
    </template>
    
    <el-table :data="performanceData" border>
      <el-table-column prop="type" label="Interconnect" />
      <el-table-column label="40G">
        <template #default="{ row }">
          <NumberCell 
            v-model="row['40G']"
            :precision="1"
            :step="0.1"
            @update:modelValue="emitUpdate"
          />
        </template>
      </el-table-column>
      <el-table-column label="100G">
        <template #default="{ row }">
          <NumberCell 
            v-model="row['100G']"
            :precision="1"
            :step="0.1"
            @update:modelValue="emitUpdate"
          />
        </template>
      </el-table-column>
      <el-table-column label="200G">
        <template #default="{ row }">
          <NumberCell 
            v-model="row['200G']"
            :precision="1"
            :step="0.1"
            @update:modelValue="emitUpdate"
          />
        </template>
      </el-table-column>
      <el-table-column label="400G">
        <template #default="{ row }">
          <NumberCell 
            v-model="row['400G']"
            :precision="1"
            :step="0.1"
            @update:modelValue="emitUpdate"
          />
        </template>
      </el-table-column>
    </el-table>

    <div class="button-container">
      <el-button type="primary" @click="addRow">Add Row</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NumberCell from './NumberCell.vue'

const performanceData = ref([
  { type: 'Fat-tree', '40G': 4.0, '100G': 3.0, '200G': 2.0, '400G': 1.0 },
  { type: 'Rail-optimized', '40G': 4.0, '100G': 3.0, '200G': 2.0, '400G': 1.0 },
  { type: 'Rail-only', '40G': 4.0, '100G': 3.0, '200G': 2.0, '400G': 1.0 },
  { type: 'TopoOpt', '40G': 4.0, '100G': 3.0, '200G': 2.0, '400G': 1.0 },
  { type: 'MixNet', '40G': 4.0, '100G': 3.0, '200G': 2.0, '400G': 1.0 }
])

const emit = defineEmits(['update:data'])

const emitUpdate = () => {
  emit('update:data', performanceData.value)
}

const addRow = () => {
  performanceData.value.push({
    type: 'New Interconnect',
    '40G': null,
    '100G': null,
    '200G': null,
    '400G': null
  })
}

// 初始化时发送数据
onMounted(() => {
  emitUpdate()
})
</script>

<style scoped>
.performance-table {
  margin-bottom: 20px;
}

.button-container {
  margin-top: 16px;
}
</style>
