<template>
  <section class="feedback-section">
    <div class="section-header">
      <h2 class="section-title">Anonymous Feedback</h2>
      <p class="section-description">Your comments will help improve this tool!</p>
    </div>
    <el-form 
      :model="form" 
      class="feedback-form"
      label-position="top"
    >
      <el-form-item 
        label="Feedback"
        class="form-item"
      >
        <el-input
          v-model="form.feedback"
          type="textarea"
          :rows="4"
          placeholder="Please share your feedback or suggestions..."
          resize="none"
        />
      </el-form-item>

      <el-form-item 
        label="Optional Email (if you want a reply)"
        class="form-item"
      >
        <el-input
          v-model="form.email"
          type="email"
          placeholder="your.email@example.com"
          clearable
        >
          <template #prefix>
            <el-icon><Message /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button 
          type="primary" 
          @click="submitForm"
          class="submit-btn"
          size="large"
        >
          <el-icon><Upload /></el-icon>
          Submit Feedback
        </el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Message, Upload } from '@element-plus/icons-vue'

const form = ref({
  feedback: '',
  email: ''
})

const submitForm = async () => {
  try {
    const response = await fetch('https://formspree.io/f/movjeqkp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: form.value.feedback || 'Anonymous feedback',
        _replyto: form.value.email || undefined
      })
    })

    if (response.ok) {
      ElMessage.success('Feedback submitted successfully')
      form.value.feedback = ''
      form.value.email = ''
    }
  } catch (error) {
    ElMessage.error('Failed to submit feedback. Please try again later.')
  }
}
</script>

<style scoped>
.feedback-section {
  padding: 40px;
  background: #f8f9fa;
  border-radius: 20px;
  margin: 40px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.8rem;
  color: #2b6cb0;
  margin-bottom: 0.5rem;
}

.section-description {
  color: #4a5568;
  font-size: 1.1rem;
}

.feedback-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-item {
  margin-bottom: 1.5rem;
}

.form-item :deep(.el-form-item__label) {
  font-weight: 500;
  color: #2d3748;
  font-size: 1rem;
}

.submit-btn {
  width: 100%;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(45, 108, 176, 0.2);
}
</style> 