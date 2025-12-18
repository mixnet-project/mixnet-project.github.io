<template>
  <div class="home">
    <header class="hero">
      <div class="hero-content">
        <div class="paper-badge">
          <span class="badge-icon">🎉</span>
          <span class="badge-text">Published at ACM SIGCOMM 2025</span>
        </div>
        <h1 class="hero-title">
          <span class="gradient-text">MixNet</span>
          <span class="hero-subtitle"
            >A Runtime Reconfigurable Optical-Electrical Fabric for large-scale
            Mixture-of-Experts (MoE) Training</span
          >
        </h1>
        <div class="hero-actions">
          <el-button
            type="danger"
            size="large"
            @click="openLink('https://doi.org/10.1145/3718958.3750465')"
          >
            <el-icon><Document /></el-icon>
            Read Paper
          </el-button>
          <el-button
            type="primary"
            size="large"
            @click="$router.push('/network')"
          >
            <el-icon><VideoPlay /></el-icon>
            View Topology
          </el-button>
          <el-button type="success" size="large" @click="goToCalculator">
            <el-icon><DataAnalysis /></el-icon>
            Cost Calculator
          </el-button>
          <el-button
            type="info"
            size="large"
            @click="openLink('https://github.com/mixnet-project/mixnet-sim')"
          >
            <el-icon><FolderOpened /></el-icon>
            Simulation Code
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

      <section class="calculator-promo">
        <div class="promo-content">
          <div class="promo-header">
            <span class="promo-icon">💰</span>
            <h2>Explore Cost Efficiency</h2>
          </div>
          <p class="promo-subtitle">Interactive analysis tools for network infrastructure</p>
          <div class="features-cards">
            <div class="feature-card">
              <div class="card-icon">📊</div>
              <h3>Compare Costs</h3>
              <p>Analyze networking cost across different interconnect architectures</p>
            </div>
            <div class="feature-card">
              <div class="card-icon">⚡</div>
              <h3>Performance Analysis</h3>
              <p>Calculate and compare performance per dollar metrics</p>
            </div>
            <div class="feature-card">
              <div class="card-icon">📈</div>
              <h3>Interactive Dashboard</h3>
              <p>Visualize results with dynamic charts and graphs</p>
            </div>
          </div>
          <el-button type="primary" size="large" @click="goToCalculator" class="launch-btn">
            <el-icon><DataAnalysis /></el-icon>
            Launch Calculator
          </el-button>
        </div>
      </section>

      <section class="mixnet-paper">
        <div class="paper-highlight">
          <div class="paper-content">
            <h3 class="paper-title">
              <span class="paper-icon">📄</span>
              MixNet: A Runtime Reconfigurable Optical-Electrical Fabric for
              Distributed Mixture-of-Experts Training
            </h3>
            <p class="paper-authors">
              Xudong Liao, Yijun Sun, Han Tian, Xinchen Wan, Yilun Jin, Zilong
              Wang, Zhenghang Ren, Xinyang Huang, Wenxue Li, Kin Fai Tse,
              Zhizhen Zhong, Guyue Liu, Ying Zhang, Xiaofeng Ye, Yiming Zhang,
              Kai Chen
            </p>
            <p class="paper-venue">
              <span class="venue-name">ACM SIGCOMM 2025</span>
              <span class="venue-pages">pp. 554–574</span>
            </p>
            <div class="paper-links">
              <el-button
                type="primary"
                @click="openLink('https://doi.org/10.1145/3718958.3750465')"
              >
                <el-icon><Document /></el-icon>
                Paper (DOI)
              </el-button>
              <el-button
                type="success"
                @click="
                  openLink('https://github.com/mixnet-project/mixnet-sim')
                "
              >
                <el-icon><FolderOpened /></el-icon>
                Simulation Code
              </el-button>
            </div>
          </div>
        </div>
      </section>

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
  Link,
  Document,
  FolderOpened,
} from "@element-plus/icons-vue";
import FeedbackForm from "@/components/FeedbackForm.vue";

const router = useRouter();

const goToCalculator = () => {
  router.push("/calculator");
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

.paper-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 24px;
  font-weight: 600;
  margin-bottom: 1.5rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.badge-icon {
  font-size: 1.2rem;
}

.badge-text {
  font-size: 0.95rem;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: #2d2d2d;
}

.gradient-text {
  background: linear-gradient(45deg, #2b6cb0, #4299e1);
  background-clip: text;
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

.calculator-promo {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 60px 40px;
  margin: 40px 0;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.calculator-promo::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(66, 153, 225, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.promo-content {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.promo-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.promo-icon {
  font-size: 2.5rem;
}

.promo-header h2 {
  font-size: 2rem;
  color: #2d3748;
  margin: 0;
}

.promo-subtitle {
  color: #4a5568;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.features-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.feature-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.2rem;
  color: #2d3748;
  margin-bottom: 0.8rem;
  font-weight: 600;
}

.feature-card p {
  font-size: 0.95rem;
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

.launch-btn {
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
}

.launch-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(66, 153, 225, 0.4);
}

.mixnet-paper {
  margin: 60px 0 40px;
}

.paper-highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 40px;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.paper-content {
  max-width: 900px;
  margin: 0 auto;
}

.paper-icon {
  font-size: 2rem;
  margin-right: 0.5rem;
}

.paper-title {
  font-size: 1.6rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.paper-authors {
  font-size: 1rem;
  opacity: 0.95;
  margin-bottom: 0.8rem;
  line-height: 1.6;
}

.paper-venue {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  align-items: center;
  flex-wrap: wrap;
}

.venue-name {
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
}

.venue-pages {
  opacity: 0.9;
  display: inline-flex;
  align-items: center;
}

.paper-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.paper-links .el-button {
  background: white;
  color: #667eea;
  border: none;
  font-weight: 600;
}

.paper-links .el-button:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .paper-badge {
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
    display: flex;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }

  .paper-highlight {
    padding: 30px 20px;
  }

  .paper-title {
    font-size: 1.3rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .paper-icon {
    margin-bottom: 0.5rem;
  }

  .paper-authors {
    font-size: 0.9rem;
  }

  .paper-venue {
    font-size: 0.95rem;
    gap: 0.8rem;
  }

  .venue-name {
    padding: 0.25rem 0.6rem;
    font-size: 0.9rem;
  }

  .venue-pages {
    font-size: 0.9rem;
  }

  .hero {
    padding: 40px 20px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
    align-items: stretch;
    padding: 0 10px;
  }

  .hero-actions .el-button {
    width: 100%;
    margin: 0;
    justify-content: center;
  }

  .calculator-promo {
    padding: 40px 20px;
  }

  .promo-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .promo-icon {
    font-size: 2rem;
  }

  .promo-header h2 {
    font-size: 1.6rem;
  }

  .promo-subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .features-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .card-icon {
    font-size: 2rem;
  }

  .feature-card h3 {
    font-size: 1.1rem;
  }

  .feature-card p {
    font-size: 0.9rem;
  }

  .launch-btn {
    width: 100%;
    font-size: 1rem;
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
