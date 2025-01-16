<template>
  <el-card class="cluster-scale">
    <template #header>
      <div class="header-content">
        <h2>Cluster Scale Configuration</h2>
        <p>
          Configure the cluster parameters for
          <strong>performance per dollar</strong>
          calculation.
        </p>
      </div>
    </template>

    <el-form :model="clusterData" label-position="top">
      <el-form-item label="Number of GPUs per Server">
        <el-input-number
          v-model="clusterData.gpusPerServer"
          :min="1"
          :max="16"
          @change="handleChange"
        />
      </el-form-item>

      <el-form-item label="Number of Servers">
        <el-input-number
          v-model="clusterData.servers"
          :min="128"
          :max="4096"
          :step="128"
          @change="handleChange"
        />
      </el-form-item>

      <!-- <el-form-item label="Oversubscription Ratio">
        <el-input-number
          v-model="clusterData.oversubscription"
          :min="0.1"
          :max="2"
          :step="0.1"
          :precision="1"
          @change="handleChange"
        />
      </el-form-item> -->
    </el-form>

    <div class="button-container">
      <el-button type="primary" @click="handleSave" :disabled="!hasChanges">
        Save Changes
      </el-button>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { ElMessage } from "element-plus";

const emit = defineEmits(["update:data"]);

// Default cluster data
const defaultClusterData = {
  gpusPerServer: 8,
  servers: 128,
  oversubscription: 1.0,
};

const clusterData = ref({ ...defaultClusterData });
const originalData = ref(null);
const hasChanges = ref(false);

function handleChange() {
  hasChanges.value =
    JSON.stringify(clusterData.value) !== JSON.stringify(originalData.value);
  emit("update:data", clusterData.value);
}

function handleSave() {
  try {
    originalData.value = JSON.parse(JSON.stringify(clusterData.value));
    hasChanges.value = false;
    ElMessage.success("Cluster configuration saved successfully");
  } catch (error) {
    console.error("Failed to save cluster configuration:", error);
    ElMessage.error("Failed to save cluster configuration");
  }
}

// Initialize on mount
onMounted(() => {
  originalData.value = JSON.parse(JSON.stringify(clusterData.value));
  emit("update:data", clusterData.value);
});
</script>

<style scoped>
.cluster-scale {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.header-content h2 {
  margin: 0;
  color: var(--el-text-color-primary);
  border-bottom: 2px solid var(--el-border-color);
  padding-bottom: 0.5rem;
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

:deep(.el-form-item) {
  margin-bottom: 1.5rem;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: var(--el-text-color-primary);
}
</style>
