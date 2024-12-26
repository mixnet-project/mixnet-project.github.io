<template>
  <el-card class="cost-table">
    <template #header>
      <h2>Cost of Networking Elements</h2>
      <p>Default values are from the paper.</p>
    </template>
    
    <el-table :data="costData" border>
      <el-table-column label="Link Bandwidth (Gbps)">
        <template #header>
          <strong>Link Bandwidth (Gbps)</strong>
        </template>
        <template #default="{ row }">
          <NumberCell v-model="row.bandwidth" @update:modelValue="emitUpdate" />
        </template>
      </el-table-column>
      <el-table-column label="Transceiver cost ($)">
        <template #header>
          <strong>Transceiver cost ($)</strong>
        </template>
        <template #default="{ row }">
          <NumberCell v-model="row.transceiver" @update:modelValue="emitUpdate" />
        </template>
      </el-table-column>
      <el-table-column label="NIC cost ($)">
        <template #header>
          <strong>NIC cost ($)</strong>
        </template>
        <template #default="{ row }">
          <NumberCell v-model="row.nic" @update:modelValue="emitUpdate" />
        </template>
      </el-table-column>
      <el-table-column label="Electrical switch port cost ($)">
        <template #header>
          <strong>Electrical switch port cost ($)</strong>
        </template>
        <template #default="{ row }">
          <NumberCell v-model="row.electrical" @update:modelValue="emitUpdate" />
        </template>
      </el-table-column>
      <el-table-column label="Optical switch port cost ($)">
        <template #header>
          <strong>Optical switch port cost ($)</strong>
        </template>
        <template #default="{ row }">
          <NumberCell v-model="row.optical" @update:modelValue="emitUpdate" />
        </template>
      </el-table-column>
      <el-table-column label="Optical patch panel port cost ($)">
        <template #header>
          <strong>Optical patch panel port cost ($)</strong>
        </template>
        <template #default="{ row }">
          <NumberCell v-model="row.panel" @update:modelValue="emitUpdate" />
        </template>
      </el-table-column>
      <el-table-column label="Optical fiber cost ($ per meter)">
        <template #header>
          <strong>Optical fiber cost ($ per meter)</strong>
        </template>
        <template #default="{ row }">
          <NumberCell v-model="row.fiber" :precision="1" @update:modelValue="emitUpdate" />
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

const costData = ref([
  {
    bandwidth: 40,
    transceiver: 39,
    nic: 354,
    electrical: 144,
    optical: 520,
    panel: 100,
    fiber: 0.3
  },
  {
    bandwidth: 100,
    transceiver: 99,
    nic: 659,
    electrical: 187,
    optical: 520,
    panel: 100,
    fiber: 0.3
  },
  {
    bandwidth: 200,
    transceiver: 239,
    nic: 1079,
    electrical: 374,
    optical: 520,
    panel: 100,
    fiber: 0.3
  },
  {
    bandwidth: 400,
    transceiver: 659,
    nic: 1499,
    electrical: 1500,
    optical: 520,
    panel: 100,
    fiber: 0.3
  }
])

const emit = defineEmits(['update:data'])

const emitUpdate = () => {
  emit('update:data', costData.value)
}

const addRow = () => {
  costData.value.push({
    bandwidth: null,
    transceiver: null,
    nic: null,
    electrical: null,
    optical: null,
    panel: null,
    fiber: null
  })
}

onMounted(() => {
  emitUpdate()
})
</script>

<style scoped>
.cost-table {
  margin-bottom: 20px;
}

.button-container {
  margin-top: 16px;
}
</style>
