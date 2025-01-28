<template>
  <el-card class="feedback-card">
    <template #header>
      <div class="header">
        <h3>Submit Anonymous Feedback</h3>
        <p>Your comments will help improve this tool</p>
      </div>
    </template>

    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item prop="comment">
        <el-input
          v-model="form.comment"
          type="textarea"
          :rows="4"
          placeholder="Please share your feedback or suggestions..."
        />
      </el-form-item>

      <p>Optional contact email (if you want a reply)</p>
      <el-form-item 
        label="Email"
        style="margin-top: 1.5rem"
      >
        <el-input
          v-model="form.contact"
          type="email"
          placeholder="your.email@example.com"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm"
          :loading="submitting"
        >
          {{ submitting ? 'Submitting...' : 'Submit Feedback' }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const form = ref({
  comment: '',
  contact: ''
})

const formRef = ref(null)
const submitting = ref(false)

const rules = {
  comment: [
    { required: true, message: 'Please input your feedback', trigger: 'blur' },
    { max: 1000, message: 'Maximum 1000 characters', trigger: 'blur' }
  ]
}

async function submitForm() {
  try {
    await formRef.value.validate()
    submitting.value = true
    
    const response = await fetch('https://formspree.io/f/movjeqkp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: form.value.comment,
        _replyto: form.value.contact || undefined
      })
    })

    if (response.ok) {
      ElMessage.success('Feedback submitted successfully')
      form.value.comment = ''
      form.value.contact = ''
    } else {
      throw new Error('Submission failed')
    }
  } catch (error) {
    ElMessage.error('Failed to submit feedback. Please try again later.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.feedback-card {
  margin-top: 2rem;
  max-width: 600px;
}

.header {
  text-align: center;
}

.header h3 {
  margin: 0;
  color: var(--el-color-primary);
}

.header p {
  margin: 0.5rem 0 0;
  color: var(--el-text-color-secondary);
}
</style> 