<template>
  <div class="page-container">
    <el-menu 
      :router="true" 
      mode="horizontal" 
      class="main-nav"
    >
      <div class="nav-content">
        <div class="nav-left">
          <el-menu-item index="/">Home</el-menu-item>
          <el-menu-item index="/calculator">Calculator</el-menu-item>
        </div>
        <!-- <div class="nav-right">
          <el-menu-item index="https://github.com">
            <el-tooltip content="Code will be available at the time of publication" placement="bottom">
              <span>GitHub</span>
            </el-tooltip>
          </el-menu-item>
        </div> -->
      </div>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const showGithubMessage = () => {
  ElMessage({
    message: 'Code will be available at the time of publication.',
    type: 'info',
    duration: 3000,
    showClose: true
  })
}
</script>

<style>
@import './style.css';

.main-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .nav-content {
    padding: 0 10px;
  }
}
</style>
