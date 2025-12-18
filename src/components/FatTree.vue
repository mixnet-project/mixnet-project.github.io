<template>
  <div class="topology-container">
    <div class="topology-header">
      <h3 class="title">Fat-tree Topology</h3>
      <p class="subtitle">Standard 3-tier datacenter network architecture (k=4)</p>
    </div>
    <div class="network-wrapper">
      <svg
        :viewBox="`0 0 ${width} ${height}`"
        :style="`transform: scale(${viewScale}); transform-origin: 0 0;`"
        @wheel.prevent="handleZoom"
      >
        <!-- 添加图例 -->
        <g class="legend">
          <rect
            x="20"
            y="20"
            width="200"
            height="120"
            fill="white"
            stroke="#ccc"
            rx="4"
          />
          <text x="40" y="45" font-size="16" fill="#ff4444">● Core Switch</text>
          <text x="40" y="65" font-size="16" fill="#4488ff">
            ● Aggregate Switch
          </text>
          <text x="40" y="85" font-size="16" fill="#44cc44">● Edge Switch</text>
          <text x="40" y="105" font-size="16" fill="#666">● GPU Node</text>
        </g>
        <!-- 连接线 -->
        <path
          v-for="(path, i) in connections"
          :key="`conn-${i}`"
          :d="path.d"
          :stroke="path.color"
          stroke-width="2.5"
          fill="none"
          opacity="0.8"
        />

        <!-- 节点 -->
        <g v-for="(node, i) in nodes" :key="`node-${i}`">
          <circle
            :cx="node.x"
            :cy="node.y"
            r="14"
            :fill="node.color"
            stroke="#fff"
            stroke-width="2"
            @mouseenter="showTooltip(node)"
            @mouseleave="hideTooltip"
          />
          <text
            v-if="node.label"
            :x="node.x"
            :y="node.y + 24"
            text-anchor="middle"
            font-size="16"
            fill="#333"
          >
            {{ node.label }}
          </text>
        </g>

        <!-- 背景网格 -->
        <pattern
          id="grid"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 100 0 L 0 0 0 100"
            fill="none"
            stroke="#eee"
            stroke-width="1"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <!-- 添加Pod框 -->
        <rect
          v-for="(pod, i) in pods"
          :key="`pod-${i}`"
          :x="pod.x"
          :y="pod.y"
          :width="pod.width"
          :height="pod.height"
          :stroke="pod.stroke"
          fill="transparent"
          stroke-width="2"
          stroke-dasharray="4"
        />
      </svg>
    </div>
    <el-tooltip
      v-model="tooltipVisible"
      :content="tooltipContent"
      placement="top"
    />

    <!-- 缩放控制 -->
    <div class="zoom-controls">
      <el-button @click="zoomIn">
        <el-icon><Plus /></el-icon>
      </el-button>
      <el-button @click="zoomOut">
        <el-icon><Minus /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Plus, Minus } from "@element-plus/icons-vue";

const width = 1200;
const height = 800;
const k = 4; // Fat-tree参数
const podCount = k;
const nodes = ref([]);
const connections = ref([]);
const isShortTerm = ref(true);
const tooltipVisible = ref(false);
const tooltipContent = ref("");
const viewScale = ref(1.0); // 初始缩放为80%
const minScale = 0.5;
const maxScale = 3;

// 生成节点
const generateNodes = () => {
  const nodeList = [];

  // 核心层布局
  const coreNodes = Math.pow(k / 2, 2);
  const coreSpacing = width / (coreNodes + 1);
  for (let i = 0; i < coreNodes; i++) {
    nodeList.push({
      type: "core",
      x: width / 2 - (coreNodes - 1) * 100 + i * 200, // 居中排列
      y: 50,
      color: "#ff4444",
      label: "",
    });
  }

  // 调整Pod位置计算
  const podSpacing = width / (podCount + 1);
  const podPositions = Array.from({ length: podCount }, (_, i) => ({
    x: podSpacing * (i + 1),
    y: 200,
  }));

  // 修改Pod内元素布局
  podPositions.forEach((pod, podIndex) => {
    const baseX = pod.x; // 使用计算好的pod位置

    // 聚合交换机布局
    for (let i = 0; i < k / 2; i++) {
      nodeList.push({
        type: "agg",
        x: baseX - 80 + i * 160, // 缩小水平间距
        y: 250,
        color: "#4488ff",
        label: "",
      });
    }

    // 边缘交换机布局
    for (let i = 0; i < k / 2; i++) {
      nodeList.push({
        type: "edge",
        x: baseX - 80 + i * 160, // 缩小水平间距
        y: 450,
        color: "#44cc44",
        label: "",
        index: podIndex * (k / 2) + i,
      });
    }

    // GPU布局
    for (let i = 0; i < Math.pow(k / 2, 2); i++) {
      nodeList.push({
        type: "GPU",
        x: baseX - 90 + (i % 4) * 60, // 缩小水平分布
        y: 550 + Math.floor(i / 4) * 80,
        color: "#666",
        label: "",
        index: podIndex * Math.pow(k / 2, 2) + i,
      });
    }

    // Pod框调整
    nodeList.push({
      type: "pod",
      x: baseX - 100, // 缩小框体宽度
      y: 320,
      width: 200,
      height: 260,
      color: "transparent",
      stroke: "#e0e0e0",
    });
  });

  return nodeList;
};

// 生成连接
const generateConnections = () => {
  const conn = [];
  const coreNodes = nodes.value.filter((n) => n.type === "core");
  const aggNodes = nodes.value.filter((n) => n.type === "agg");
  const edgeNodes = nodes.value.filter((n) => n.type === "edge");

  // 核心到聚合 - Fat-Tree标准连接模式
  aggNodes.forEach((agg, aggIndex) => {
    // 确定聚合交换机属于哪个Pod
    const podIndex = Math.floor(aggIndex / (k / 2));
    const aggIndexInPod = aggIndex % (k / 2);
    
    // 每个聚合交换机连接k/2个核心交换机
    // Pod内的聚合交换机均匀分配到不同的核心交换机组
    for (let i = 0; i < k / 2; i++) {
      const coreIndex = aggIndexInPod * (k / 2) + i;
      if (coreNodes[coreIndex]) {
        conn.push({
          d: `M ${coreNodes[coreIndex].x} ${coreNodes[coreIndex].y} L ${agg.x} ${agg.y}`,
          color: "#ff8844",
        });
      }
    }
  });

  // 聚合到边缘
  edgeNodes.forEach((edge) => {
    const podIndex = Math.floor(edgeNodes.indexOf(edge) / (k / 2));
    const relatedAgg = aggNodes.slice(
      podIndex * (k / 2),
      (podIndex + 1) * (k / 2)
    );
    relatedAgg.forEach((agg) => {
      conn.push({
        d: `M ${agg.x} ${agg.y} L ${edge.x} ${edge.y}`,
        color: "#44aaff",
      });
    });
  });

  // 边缘到GPU
  nodes.value
    .filter((n) => n.type === "GPU")
    .forEach((gpu) => {
      const relatedEdge = edgeNodes.find((edge) => {
        // 每个Pod包含 (k/2)^2 个GPU
        const gpusPerPod = Math.pow(k / 2, 2);
        const edgesPerPod = k / 2;
        const gpusPerEdge = k / 2;

        // 计算当前GPU所属的Pod
        const podIndex = Math.floor(gpu.index / gpusPerPod);

        // 在Pod内的局部索引
        const localGpuIndex = gpu.index % gpusPerPod;

        // 确定对应的边缘交换机（每个边缘服务k/2个GPU）
        const edgeIndexInPod = Math.floor(localGpuIndex / gpusPerEdge);

        // 全局边缘交换机索引
        const targetEdgeIndex = podIndex * edgesPerPod + edgeIndexInPod;

        return edge.index === targetEdgeIndex;
      });

      if (relatedEdge) {
        conn.push({
          d: `M ${relatedEdge.x} ${relatedEdge.y} L ${gpu.x} ${gpu.y}`,
          color: "#666",
          opacity: 0.8,
        });
      }
    });

  return conn;
};

// 初始化
onMounted(() => {
  nodes.value = generateNodes();
  connections.value = generateConnections();
});

// 工具提示
const showTooltip = (node) => {
  tooltipContent.value = `${node.label} (${node.type})`;
  tooltipVisible.value = true;
};

const hideTooltip = () => {
  tooltipVisible.value = false;
};

// 切换模式
const toggleMode = () => {
  isShortTerm.value = !isShortTerm.value;
  // 可在此添加不同模式的连接逻辑
};

// 缩放控制
const zoomIn = () => {
  viewScale.value = Math.min(maxScale, viewScale.value * 1.1);
};

const zoomOut = () => {
  viewScale.value = Math.max(minScale, viewScale.value * 0.9);
};

const handleZoom = (e) => {
  // const delta = e.deltaY > 0 ? 0.9 : 1.1
  // viewScale.value = Math.min(maxScale, Math.max(minScale, viewScale.value * delta))
};

// 添加pod数据引用
const pods = computed(() => nodes.value.filter((n) => n.type === "pod"));
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
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
  padding: 30px;
  overflow: auto;
  height: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.network-wrapper:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.legend {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.legend text {
  dominant-baseline: middle;
  font-weight: 500;
}

.controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.zoom-controls {
  position: fixed;
  right: 40px;
  bottom: 40px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.zoom-controls .el-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: white;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.zoom-controls .el-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  border-color: #4299e1;
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
    height: 400px;
    padding: 15px;
  }

  .zoom-controls {
    right: 20px;
    bottom: 20px;
  }

  .zoom-controls .el-button {
    width: 40px;
    height: 40px;
  }
}
</style>
