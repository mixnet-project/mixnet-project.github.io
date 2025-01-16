<template>
  <el-card class="performance-table">
    <template #header>
      <div class="header-content">
        <h2>Normalized Training Iteration Time</h2>
        <div class="model-selector">
          <div class="selector-label">Select Model:</div>
          <div class="model-options">
            <el-radio-group v-model="selectedModel" @change="handleModelChange">
              <el-radio-button
                v-for="model in availableModels"
                :key="model"
                :value="model"
              >
                {{ model }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
    </template>

    <el-table :data="performanceData" border>
      <el-table-column prop="type" label="Interconnect">
        <template #default="{ row }">
          <strong>{{ row.type }}</strong>
        </template>
      </el-table-column>

      <el-table-column
        v-for="bandwidth in bandwidths"
        :key="bandwidth"
        :label="`${bandwidth}G`"
      >
        <template #default="{ row }">
          <NumberCell
            v-model="row[bandwidth]"
            :precision="3"
            :step="0.001"
            @update:modelValue="emitUpdate"
          />
        </template>
      </el-table-column>
    </el-table>

    <div class="table-footer">
      <el-button type="primary" @click="handleSave" :disabled="!hasChanges">
        Save Changes
      </el-button>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NumberCell from "./NumberCell.vue";
import { ElMessage } from "element-plus";

const selectedModel = ref("Mixtral 8*22B");
const bandwidths = [100, 200, 400, 800];

const availableModels = [
  "Mixtral 8*22B",
  "Mixtral 8*7B",
  "Qwen-MoE",
  "Llama-MoE",
];

const topoDisplayMapping = {
  fattree: "Fat-tree",
  mixnet: "MixNet",
  "rail-optimized": "Rail-optimized",
  topoopt: "TopoOpt",
};

const performanceData = ref([]);
const perfData = ref([]);
const emit = defineEmits(["update:data"]);

const hasChanges = ref(false);
const originalData = ref(null);

const emitUpdate = () => {
  // Check if current data is different from original data
  hasChanges.value =
    JSON.stringify(performanceData.value) !==
    JSON.stringify(originalData.value);

  performanceData.value.forEach((row) => {
    bandwidths.forEach((bw) => {
      const existingDataIndex = perfData.value.findIndex(
        (item) =>
          item.type === row.type &&
          item.Model === selectedModel.value &&
          item.Bandwidth === bw
      );

      if (existingDataIndex !== -1) {
        perfData.value[existingDataIndex].value = row[bw];
      }
    });
  });

  const updatedData = [];
  performanceData.value.forEach((row) => {
    bandwidths.forEach((bw) => {
      updatedData.push({
        type: row.type,
        model: selectedModel.value,
        bandwidth: bw,
        value: row[bw],
      });
    });
  });

  emit("update:data", updatedData);
};

const handleModelChange = (model) => {
  loadModelData(model);
};

async function loadModelData(model = selectedModel.value) {
  try {
    if (perfData.value.length === 0) {
      await loadPerformanceData();
    }

    const uniqueTopos = [...new Set(perfData.value.map((item) => item.type))];
    const tableData = [];
    uniqueTopos.forEach((topo) => {
      const row = { type: topo };

      bandwidths.forEach((bw) => {
        const modelData = perfData.value.find(
          (d) => d.Model === model && d.type === topo && d.Bandwidth === bw
        );
        row[bw] = modelData ? modelData.value : null;
      });

      tableData.push(row);
    });

    performanceData.value = tableData;
    // Store a deep copy of the original data
    originalData.value = JSON.parse(JSON.stringify(tableData));
    hasChanges.value = false;
    emitUpdate();
  } catch (error) {
    console.error("Failed to load model data:", error);
  }
}

async function loadPerformanceData() {
  try {
    const response = await fetch("/data/normalized_performance.csv");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();

    const lines = csvText.split("\n").filter((line) => line.trim());
    if (lines.length === 0) {
      throw new Error("CSV file is empty");
    }

    const headers = lines[0].split(",").map((h) => h.trim());

    perfData.value = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values = line.split(",").map((v) => v.trim());

      if (values.length !== headers.length) continue;

      const model = values[headers.indexOf("Model")];
      const bandwidth = values[headers.indexOf("Bandwidth")];
      // Get topology types dynamically from headers
      const topoTypes = headers.filter(
        (h) => !["Model", "Bandwidth", "type"].includes(h)
      );
      topoTypes.forEach((topo) => {
        const value = parseFloat(values[headers.indexOf(topo)]);
        if (!isNaN(value)) {
          perfData.value.push({
            Model: model,
            Bandwidth: parseInt(bandwidth),
            type: topoDisplayMapping[topo],
            value: parseFloat(value),
          });
        }
      });
    }

    return perfData.value;
  } catch (error) {
    console.error("Error loading performance data:", error);
    ElMessage.error(`Failed to load data: ${error.message}`);
    throw error;
  }
}

// Add save handler
const handleSave = () => {
  try {
    // Update originalData to match current data
    originalData.value = JSON.parse(JSON.stringify(performanceData.value));
    hasChanges.value = false;

    // Show success message
    ElMessage({
      message: "Changes saved successfully",
      type: "success",
    });
  } catch (error) {
    console.error("Failed to save changes:", error);
    ElMessage.error("Failed to save changes");
  }
};

onMounted(async () => {
  try {
    await loadModelData();
  } catch (error) {
    console.error("Failed to load initial data:", error);
    ElMessage.error(
      "Failed to load performance data. Please check the console for details."
    );
  }
});

defineExpose({
  perfData,
});
</script>

<style scoped>
.performance-table {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-content h2 {
  margin: 0;
  color: var(--el-text-color-primary);
  border-bottom: 2px solid var(--el-border-color);
  padding-bottom: 0.5rem;
}

.model-selector {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.5rem 0;
}

.selector-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.model-options {
  flex: 1;
}

:deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

:deep(.el-radio-button__inner) {
  padding: 8px 16px;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .model-selector {
    flex-direction: column;
    align-items: flex-start;
  }

  .model-options {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  :deep(.el-radio-group) {
    flex-wrap: nowrap;
  }
}

.table-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem;
}

/* Add responsive styles for the footer */
@media (max-width: 768px) {
  .table-footer {
    justify-content: center;
  }
}
</style>
