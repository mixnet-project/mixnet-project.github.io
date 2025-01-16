<template>
  <div class="bandwidth-selector">
    <div class="selector-label">Select Bandwidth:</div>
    <div class="bandwidth-options">
      <el-radio-group
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        @change="$emit('change', $event)"
      >
        <el-radio-button v-for="bw in bandwidths" :key="bw" :value="`${bw}G`">
          {{ bw }}G
        </el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  bandwidths: {
    type: Array,
    required: true,
  },
});

defineEmits(["update:modelValue", "change"]);
</script>

<style scoped>
.bandwidth-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}

.selector-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.bandwidth-options {
  flex: 1;
}

@media (max-width: 768px) {
  .bandwidth-selector {
    flex-direction: column;
    align-items: flex-start;
  }

  .bandwidth-options {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
}
</style>
