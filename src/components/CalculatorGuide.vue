<template>
  <el-dialog 
    title="Calculator Usage Guide" 
    v-model="visible" 
    width="800px"
    class="guide-dialog"
  >
    <div class="guide-content">
      <div class="tips">
        <el-alert type="info" :closable="false">
          <template #title>
            Tips:
            <ul>
              <li>Click <b>Save Changes</b> after modifying inputs</li>
              <li>Hover over chart elements for details</li>
              <li>Use model selector to prepare the performance data for different models</li>
              <li>Use the bandwidth selector to compare rates</li>
            </ul>
          </template>
        </el-alert>
      </div>

      <h3>Component Overview</h3>
      <el-steps direction="vertical" :active="6">
        <el-step title="Networking Cost Input">
          <template #description>
            <p>Edit cost parameters for different bandwidths:</p>
            <ul>
              <li>Transceiver/NIC costs</li>
              <li>Switch port costs</li>
              <li>Fiber costs</li>
            </ul>
          </template>
        </el-step>

        <el-step title="Cluster Configuration">
          <template #description>
            <p>Configure your GPU cluster parameters:</p>
            <ul>
              <li>GPUs per Server (1-16)</li>
              <li>Number of Servers (128-4096)</li>
            </ul>
          </template>
        </el-step>

        <el-step title="Performance Data">
          <template #description>
            <p>Input normalized training times:</p>
            <ul>
              <li>Select different MoE models</li>
              <li>Edit values for each topology</li>
            </ul>
          </template>
        </el-step>

        <el-step title="Cost Analysis">
          <template #description>
            <p>Networking Cost Chart shows:</p>
            <ul>
              <li>Cost vs Cluster Scale</li>
              <li>Compare different topologies</li>
            </ul>
          </template>
        </el-step>

        <el-step title="Performance/Cost Results">
          <template #description>
            <p>Result Chart displays:</p>
            <ul>
              <li>Normalized Performance per Million $</li>
              <li>Model comparisons</li>
              <li>Bandwidth analysis</li>
            </ul>
          </template>
        </el-step>
      </el-steps>

      <h3 class="workflow-title">Typical Workflow</h3>
      <h4> Networking Cost Analysis</h4>
      <ol class="workflow-steps">
        <li>Input cost data (or use defaults) and save changes</li>
        <li>Click the <b>Calculate Networking Cost</b> button</li>
        <li>Compare the cost of different topologies with respect to cluster scale</li>
      </ol>
      <h4> Cost-efficiency Analysis</h4>
      <ol class="workflow-steps">
        <li>Configure cluster scale</li>
        <li>Select model and input performance data</li>
        <li>Click <b>Calculate Performance/Cost</b> button</li>
        <li>Compare results across topologies</li>
      </ol>

    </div>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)

defineExpose({
  show: () => visible.value = true
})
</script>

<style scoped>
.guide-content {
  padding: 0 20px;
}

h3 {
  color: var(--el-color-primary);
  margin: 20px 0 10px;
}

h4 {
  color: var(--el-color-primary);
  margin: 10px 0;
}

.workflow-steps {
  padding-left: 20px;
  margin: 15px 0;
  li {
    margin: 8px 0;
    color: var(--el-text-color-regular);
  }
}

.tips {
  margin: 20px 0;
  :deep(.el-alert__title) {
    font-size: 14px;
    ul {
      margin: 10px 0 0 15px;
      padding-left: 0;
      list-style-position: inside;
    }
  }
}

:deep(.el-step__description) {
  p {
    margin: 5px 0;
  }
  ul {
    margin: 5px 0 0 15px;
    padding-left: 0;
    li {
      &::before {
        /* content: '•'; */
        display: inline-block;
        margin-right: 8px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
</style> 