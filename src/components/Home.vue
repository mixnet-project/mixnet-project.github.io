<template>
  <div class="home">
    <header class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="gradient-text">MixNet</span>
          <span class="hero-subtitle"
            >A Runtime Reconfigurable Optical-Electrical Fabric for large-scale
            Mixture-of-Experts (MoE) Training</span
          >
        </h1>
        <div class="hero-actions">
          <!-- <el-button type="primary" size="large" @click="$router.push('/network')">
            <el-icon><VideoPlay /></el-icon>
            View Topology
          </el-button> -->
          <el-button type="success" size="large" @click="goToCalculator">
            <el-icon><DataAnalysis /></el-icon>
            Cost-efficiency Calculator
          </el-button>
          <el-button type="info" size="large" @click="goToGithub">
            <el-icon><Collection /></el-icon>
            View Code on GitHub
          </el-button>
        </div>
      </div>
    </header>

    <div class="content">
      <section class="intro">
        <div class="section-header">
          <h2 class="section-title">Key Innovations</h2>
          <p class="section-description">
            Redesigning network infrastructure for large-scale MoE training with
            regional topology reconfigurations
          </p>
        </div>
        <p class="project-description">
          MixNet pioneers the first runtime reconfigurable GPU interconnect that
          fuses optical circuit switching with electrical networks, enabling
          2.3x higher cost-efficiency than traditional static topologies for
          large-scale Mixture-of-Experts (MoE) training. By dynamically
          reshaping network topology to match MoE's sparse and non-uniform
          communication patterns, MixNet delivers:
        </p>
        <div class="features-grid">
          <div class="feature-item">
            <span class="feature-icon">🚀</span>
            <div>
              <h4>2.3x higher cost-efficiency</h4>
              <p>
                MixNet achieves performance comparable to non-blocking Fat-tree
                and Rail-optimized topologies, while significantly reducing the
                cost of network infrastructure.
              </p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">⚡</span>
            <div>
              <h4>Millisecond-scale Adaptation</h4>
              <p>
                MixNet uses <b>commodity</b> optical switches (e.g.,
                <a
                  href="https://www.polatis.com/series-7000-384x384-port-software-controlled-optical-circuit-switch-sdn-enabled.asp"
                  >Polatis Series 7000</a
                >) to achieve millisecond-scale topology adaptation
              </p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🌐</span>
            <div>
              <h4>30,000+ GPUs Scalability</h4>
              <p>
                MixNet's regional reconfiguration philosophy allows for
                scalability similar to a Fat-tree topology. For example, MixNet
                can easily scale to 30,000+ GPUs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div class="promo-container">
        <section class="calculator-promo">
          <div class="promo-content">
            <div class="promo-text">
              <h2>Explore Cost Efficiency</h2>
              <ul>
                <li>Compare networking cost of different interconnects</li>
                <li>Analyze the performance per dollar</li>
                <li>Visualize the results with interactive dashboard</li>
              </ul>
              <el-button type="primary" size="large" @click="goToCalculator">
                Launch Calculator →
              </el-button>
            </div>
            <div class="promo-visual">
              <!-- <img src="@/assets/calculator-preview.svg" alt="Calculator Preview"> -->
            </div>
          </div>
        </section>

        <section class="github-cta">
          <div class="cta-content">
            <!-- <el-icon class="cta-icon"><Star /></el-icon> -->
            <h3>Get Started</h3>
            <!-- <p>Join our community to shape the future of AI infrastructure</p> -->
            <el-button type="info" size="large" @click="goToGithub">
              <el-icon><Collection /></el-icon>
              View Code on GitHub
            </el-button>
          </div>
        </section>
      </div>

      <section class="references">
        <div class="section-header">
          <h2 class="section-title">Key References</h2>
          <!-- <p class="section-description">Foundational works in network architecture</p> -->
        </div>

        <ul class="reference-list">
          <li
            v-for="(ref, index) in references"
            :key="index"
            class="reference-item"
          >
            <div class="reference-content">
              <div class="title-row">
                <span class="reference-shortname">{{ ref.shortName }}: </span>
                <span class="reference-title">"{{ ref.title }}"</span>
                <span class="reference-authors">{{ ref.authors }}</span>
              </div>
              <div class="meta-row">
                <span class="reference-conference">{{ ref.conference }}</span>
                <span class="reference-year">{{ ref.year }}</span>
              </div>
            </div>
            <el-icon class="reference-link" @click="openLink(ref.url)">
              <Link />
            </el-icon>
          </li>
        </ul>
      </section>

      <FeedbackForm />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  VideoPlay,
  DataAnalysis,
  Star,
  Collection,
  Link,
} from "@element-plus/icons-vue";
import FeedbackForm from "@/components/FeedbackForm.vue";

const router = useRouter();

const goToCalculator = () => {
  router.push("/calculator");
};

const goToGithub = () => {
  ElMessage({
    message: "Code will be available at the time of publication.",
    type: "info",
    duration: 3000,
    showClose: true,
  });
};

const references = [
  {
    shortName: "Fat-tree",
    authors: "M. Al-Fares et al.",
    title: "A Scalable, Commodity Data Center Network Architecture",
    conference: "ACM SIGCOMM",
    year: 2008,
    url: "https://dl.acm.org/doi/10.1145/1402946.1402967",
  },
  {
    shortName: "Rail-optimized",
    authors: "Nvidia.",
    title:
      "Doubling all2all Performance with NVIDIA Collective Communication Library 2.12",
    conference: "Online",
    year: 2022,
    url: "https://developer.nvidia.com/blog/doubling-all2all-performance-with-nvidia-collective-communication-library-2-12/",
  },
  {
    shortName: "Lightwave Fabrics",
    authors: "H. Liu et al.",
    title:
      "At-Scale Optical Circuit Switching for Datacenter and Machine Learning Systems",
    conference: "ACM SIGCOMM",
    year: 2023,
    url: "https://dl.acm.org/doi/10.1145/3603269.3604836",
  },
  {
    shortName: "TopoOpt",
    authors: "W. Wang et al.",
    title:
      "Co-optimizing Network Topology and Parallelization Strategy for Distributed Training Jobs",
    conference: "USENIX NSDI",
    year: 2023,
    url: "https://www.usenix.org/conference/nsdi23/presentation/wang-weiyang",
  },
];

const openLink = (url) => {
  window.open(url, "_blank");
};
</script>

<style scoped>
.home {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 24px;
  margin: 40px 0;
  padding: 40px 20px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: #2d2d2d;
}

.gradient-text {
  background: linear-gradient(45deg, #2b6cb0, #4299e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  display: block;
  font-size: 1.8rem;
  font-weight: 300;
  margin-top: 1rem;
  color: #4a5568;
  /* width: 800px; */
}

.hero-actions {
  margin-top: 2.5rem;
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.content {
  display: grid;
  gap: 40px;
  margin: 60px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.2rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.section-description {
  color: #666;
  font-size: 1.1rem;
}

.promo-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 30px;
  margin: 40px 0;
}

.calculator-promo,
.github-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
  min-height: 250px;
}

.calculator-promo {
  background: #f8f9fa;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.github-cta {
  background: linear-gradient(135deg, #ced4d4 0%, #9dbcd5 100%);
  border-radius: 20px;
  color: white;
}

.promo-content,
.cta-content {
  width: 100%;
  max-width: 400px;
}

.calculator-promo .el-button,
.github-cta .el-button {
  width: 200px;
  margin-top: 1.5rem;
}

.promo-text h2,
.cta-content h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.promo-visual {
  flex: 1;
  min-width: 400px;
}

.promo-visual img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.cta-icon {
  font-size: 3rem;
  color: #fff;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .hero {
    padding: 40px 20px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .promo-container {
    grid-template-columns: 1fr;
  }

  .calculator-promo,
  .github-cta {
    min-height: 100px;
    padding: 20px 20px;
  }

  .promo-visual {
    min-width: auto;
  }
}

.features-grid {
  display: grid;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
  background: rgba(245, 245, 245, 0.3);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(245, 245, 245, 0.5);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2rem;
  min-width: 50px;
  text-align: center;
}

.feature-item h4 {
  margin: 0 0 0.3rem;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.feature-item p {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
}

.promo-text ul {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.promo-text li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 1.6;
  color: #4a5568;
}

.promo-text li:before {
  content: "•";
  position: absolute;
  left: 0;
  color: #2b6cb0;
  font-size: 1.3rem;
  top: 0.1em;
}

@media (max-width: 768px) {
  .promo-text li {
    font-size: 0.95rem;
    padding-left: 1.5rem;
  }

  .promo-text li:before {
    font-size: 1.1rem;
  }
}

.references {
  margin: 10px 0;
}

.reference-list {
  list-style: none;
  padding: 0;
  max-width: 800px;
  margin: 0 auto;
}

.reference-item {
  padding: 1rem;
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  max-width: 1000px;
}

.reference-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.reference-content {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding-right: 40px;
}

.title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.6rem;
  margin-bottom: 0.4rem;
}

.reference-shortname {
  font-weight: 600;
  color: #2b6cb0;
  white-space: nowrap;
}

.reference-title {
  font-style: italic;
  color: #2d3748;
  line-height: 1.4;
  flex: 1;
  min-width: 60%;
}

.reference-authors {
  font-size: 0.95rem;
  color: #4a5568;
  white-space: nowrap;
}

.meta-row {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  color: #718096;
  font-size: 0.9rem;
}

.reference-conference:after {
  content: "•";
  margin-left: 0.8rem;
  color: #cbd5e0;
}

.reference-link {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #4299e1;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reference-link:hover {
  color: #2b6cb0;
  transform: translateY(-50%) scale(1.1);
}

@media (max-width: 768px) {
  .reference-item {
    padding: 0.8rem;
  }

  .reference-title {
    font-size: 0.95rem;
  }

  .reference-link {
    right: 0.8rem;
    font-size: 1.1rem;
  }
}
</style>
