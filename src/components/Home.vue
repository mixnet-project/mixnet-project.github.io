<template>
  <div class="home">
    <h1>MixNet: Reconfigurable Optical-Electrical Fabric for Mixture-of-Experts Training</h1>

    <div class="content">
      <section class="intro">
        <h3>About the Project</h3>
        <p>
          MixNet is a network architecture that uses reconfigurable optical interconnects with existing electrical network to achieve high-speed, low-cost and scalable  network connectivity for large-scale Mixture-of-Experts (MoE) training systems.
        </p>
      </section>

      <section class="features">
        <h3>Cost-Performance Analysis</h3>
        <ul>
          <li>Compare different network architectures</li>
          <li>Analyze performance/cost ratios</li>
          <li>Visualize results with interactive charts</li>
          <li>Export calculation results</li>
        </ul>
        <el-button type="primary" @click="goToCalculator">
          Launch Calculator
        </el-button>
      </section>

      <section class="get-started">
        <h3>Get Started</h3>
        <el-button type="info" @click="goToGithub">
          View on GitHub
        </el-button>
      </section>

      <!-- <section class="code-info">
        <h3>Project Information</h3>
        <p>
          <strong>Version:</strong> 1.0.0<br>
          <strong>Repository:</strong> <a href="https://github.com/yourusername/project">GitHub Repository</a><br>
          <strong>License:</strong> MIT
        </p>
      </section> -->
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const goToCalculator = () => {
  router.push('/calculator')
}

const goToGithub = () => {
  ElMessage({
    message: 'Code will be available at the time of publication.',
    type: 'info',
    duration: 3000,
    showClose: true
  })
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

section {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  transition: all var(--transition-speed);
}

section:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

h1 {
  font-size: 3em;
  margin-bottom: 10px;
  background: linear-gradient(45deg, var(--primary-color), #36cfc9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
}

h3 {
  margin-bottom: 15px;
  color: var(--primary-color);
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  padding-left: 20px;
  position: relative;
}

li:before {
  content: "•";
  color: var(--primary-color);
  position: absolute;
  left: 0;
}

.get-started {
  text-align: center;
}

.get-started .el-button {
  margin: 10px;
}

.features {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.features ul {
  width: 100%;
  margin-bottom: 20px;
}

.features .el-button {
  width: 200px;
}
</style> 