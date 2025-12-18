<template>
  <div class="topology-container">
    <div class="topology-header">
      <h3 class="title">MixNet Architecture</h3>
      <p class="subtitle">Runtime reconfigurable optical-electrical hybrid network</p>
    </div>
    <div class="network-wrapper">
      <div class="mixnet-controls">
        <el-button @click="zoomIn" size="small">
          <el-icon><Plus /></el-icon>
        </el-button>
        <el-button @click="zoomOut" size="small">
          <el-icon><Minus /></el-icon>
        </el-button>
        <el-button @click="resetZoom" size="small">
          <el-icon><FullScreen /></el-icon>
        </el-button>
      </div>
      <div class="image-container" :style="{ transform: `scale(${zoomLevel})` }">
        <img :src="mixnetImage" class="mixnet-image" alt="Mixnet Architecture"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Minus, FullScreen } from '@element-plus/icons-vue'
import mixnetImage from '@/assets/mixnet.png'

const zoomLevel = ref(1)

const zoomIn = () => {
  zoomLevel.value = Math.min(3, zoomLevel.value + 0.1)
}

const zoomOut = () => {
  zoomLevel.value = Math.max(0.5, zoomLevel.value - 0.1)
}

const resetZoom = () => {
  zoomLevel.value = 1
}
</script>

<style scoped>
.topology-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.topology-header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.subtitle {
  color: #4a5568;
  font-size: 1.1rem;
  margin: 0;
}

.network-wrapper {
  position: relative;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
  padding: 30px;
  overflow: auto;
  min-height: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.network-wrapper:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.mixnet-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  gap: 8px;
  background: white;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.mixnet-controls .el-button {
  border: 1px solid #e2e8f0;
}

.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
  transform-origin: center;
}

.mixnet-image {
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 768px) {
  .topology-container {
    padding: 20px 10px;
  }

  .title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .network-wrapper {
    padding: 15px;
    min-height: 400px;
  }

  .mixnet-controls {
    top: 10px;
    right: 10px;
    padding: 6px;
  }
}
</style> 