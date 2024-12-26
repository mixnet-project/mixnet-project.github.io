<template>
  <el-input-number 
    v-model="value"
    :placeholder="placeholder"
    :precision="precision"
    :step="step"
    :min="min"
    controls-position="right"
    @change="$emit('update:modelValue', $event)"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  },
  precision: {
    type: Number,
    default: 0
  },
  step: {
    type: Number,
    default: 1
  },
  min: {
    type: Number,
    default: 0
  }
})

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const placeholder = computed(() => props.modelValue?.toString() || '')

const emit = defineEmits(['update:modelValue'])
</script> 