<template>
  <div class="network-view">
    <div class="view-header">
      <h1 class="page-title">Network Topology Visualization</h1>
      <p class="page-subtitle">Interactive comparison of datacenter network architectures</p>
    </div>

    <div class="mode-switcher">
      <el-radio-group v-model="currentMode" size="large">
        <el-radio-button label="fat-tree">
          <span class="radio-icon">🌳</span>
          Fat-Tree
        </el-radio-button>
        <el-radio-button label="mixnet">
          <span class="radio-icon">⚡</span>
          MixNet
        </el-radio-button>
      </el-radio-group>
    </div>
    
    <transition name="fade" mode="out-in">
      <FatTree v-if="currentMode === 'fat-tree'" key="fat-tree"/>
      <Mixnet v-else key="mixnet"/>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FatTree from './FatTree.vue'
import Mixnet from './Mixnet.vue'

const currentMode = ref('fat-tree')
</script>

<style scoped>
.network-view {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f7fafc 0%, #ffffff 100%);
  padding: 40px 20px;
}

.view-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
  font-weight: 700;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #4a5568;
  margin: 0;
}

.mode-switcher {
  text-align: center;
  margin-bottom: 40px;
  position: sticky;
  top: 20px;
  z-index: 100;
  padding: 20px 0;
  background: linear-gradient(to bottom, 
    rgba(247, 250, 252, 0.95) 0%, 
    rgba(247, 250, 252, 0.8) 100%);
  backdrop-filter: blur(10px);
}

.mode-switcher :deep(.el-radio-group) {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 6px;
  background: white;
}

.mode-switcher :deep(.el-radio-button__inner) {
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
}

.radio-icon {
  font-size: 1.3rem;
  margin-right: 8px;
}

.mode-switcher :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: linear-gradient(135deg, #4299e1 0%, #667eea 100%);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
}

/* 淡入淡出过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 768px) {
  .network-view {
    padding: 20px 10px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .mode-switcher {
    margin-bottom: 20px;
  }

  .mode-switcher :deep(.el-radio-button__inner) {
    padding: 10px 20px;
    font-size: 1rem;
  }

  .radio-icon {
    font-size: 1.1rem;
    margin-right: 6px;
  }
}
</style> 