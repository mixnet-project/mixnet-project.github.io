<template>
  <el-card class="cost-table">
    <template #header>
      <div class="header-content">
        <h2>Cost of Networking Elements</h2>
        <p>Default values are from the paper.</p>
      </div>
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
          <NumberCell
            v-model="row.transceiver"
            @update:modelValue="emitUpdate"
          />
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
          <NumberCell
            v-model="row.electrical"
            @update:modelValue="emitUpdate"
          />
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
          <NumberCell
            v-model="row.fiber"
            :precision="1"
            @update:modelValue="emitUpdate"
          />
        </template>
      </el-table-column>
    </el-table>

    <div class="button-container">
      <el-button type="primary" @click="handleSave" :disabled="!hasChanges">
        Save Changes
      </el-button>
      <!-- <el-button type="primary" @click="addRow">Add Row</el-button> -->
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NumberCell from "./NumberCell.vue";
import { ElMessage } from "element-plus";

// Available bandwidth options
const bandwidthOptions = [100, 200, 400, 800];

// Default cost data based on cost.json
const defaultCostData = [
  {
    bandwidth: 100,
    transceiver: 99,
    nic: 659,
    electrical: 187,
    optical: 520,
    panel: 100,
    fiber: 0.3,
  },
  {
    bandwidth: 200,
    transceiver: 239,
    nic: 1079,
    electrical: 374,
    optical: 520,
    panel: 100,
    fiber: 0.3,
  },
  {
    bandwidth: 400,
    transceiver: 659,
    nic: 1499,
    electrical: 1090,
    optical: 520,
    panel: 100,
    fiber: 0.3,
  },
  {
    bandwidth: 800,
    transceiver: 1399,
    nic: 2248,
    electrical: 1400,
    optical: 520,
    panel: 100,
    fiber: 0.3,
  },
];

const costData = ref([...defaultCostData]);
const originalData = ref(null);
const hasChanges = ref(false);

const emit = defineEmits(["update:data"]);

const emitUpdate = () => {
  hasChanges.value =
    JSON.stringify(costData.value) !== JSON.stringify(originalData.value);
  emit("update:data", costData.value);
};

const handleSave = () => {
  try {
    originalData.value = JSON.parse(JSON.stringify(costData.value));
    hasChanges.value = false;
    ElMessage.success("Changes saved successfully");
  } catch (error) {
    console.error("Failed to save changes:", error);
    ElMessage.error("Failed to save changes");
  }
};

const addRow = () => {
  costData.value.push({
    bandwidth: 100,
    transceiver: null,
    nic: null,
    electrical: null,
    optical: null,
    panel: null,
    fiber: 0.3,
  });
  emitUpdate();
};

onMounted(() => {
  originalData.value = JSON.parse(JSON.stringify(costData.value));
  emitUpdate();
});
</script>

<style scoped>
.cost-table {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.header-content h2 {
  margin: 0;
}

.header-content p {
  margin: 0;
  color: var(--el-text-color-secondary);
}

.button-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

@media (max-width: 768px) {
  .button-container {
    justify-content: center;
  }
}

:deep(.el-select) {
  width: 100%;
}
</style>
