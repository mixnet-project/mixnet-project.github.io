<template>
  <div class="home">
    <h1>MixNet: Reconfigurable Optical-Electrical Fabric for MoE Training</h1>

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
    message: 'Code will be available on the time of publication.',
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
}

h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

h2 {
  font-size: 1.5em;
  color: #666;
  margin-bottom: 40px;
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

h3 {
  margin-bottom: 15px;
  color: #409EFF;
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
  color: #409EFF;
  position: absolute;
  left: 0;
}

.get-started {
  text-align: center;
}

.get-started .el-button {
  margin: 10px;
}

.code-info p {
  line-height: 1.6;
}

a {
  color: #409EFF;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style> 