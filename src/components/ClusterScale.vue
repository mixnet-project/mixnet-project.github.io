<template>
  <el-card class="cluster-scale">
    <template #header>
      <h2>Training Cluster Setting</h2>
    </template>
    
    <el-table :data="[clusterData]" border>
      <el-table-column label="Number of Servers">
        <template #default="{ row }">
          <NumberCell 
            v-model="row.servers"
            :min="1"
            @update:modelValue="emitUpdate"
          />
        </template>
      </el-table-column>
      <el-table-column label="Number of GPUs per Server">
        <template #default="{ row }">
          <NumberCell 
            v-model="row.gpusPerServer"
            :min="1"
            @update:modelValue="emitUpdate"
          />
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NumberCell from './NumberCell.vue'

const clusterData = ref({
  servers: 128,
  gpusPerServer: 8
})

const emit = defineEmits(['update:data'])

const emitUpdate = () => {
  emit('update:data', clusterData.value)
}

onMounted(() => {
  emitUpdate()
})
</script>

<style scoped>
.cluster-scale {
  margin-bottom: 20px;
}
</style>
