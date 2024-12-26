<template>
  <el-card class="result-table" v-if="results">
    <template #header>
      <div class="header-with-controls">
        <h2>Total Networking Cost</h2>
        <el-input
          v-model="searchQuery"
          placeholder="Search networks..."
          clearable
          style="width: 200px"
        />
      </div>
    </template>
    
    <el-table 
      :data="filteredResults" 
      border
      :default-sort="{ prop: 'type', order: 'ascending' }"
    >
      <el-table-column 
        prop="type" 
        label="Network Type"
        sortable
      />
      <el-table-column prop="40G" label="40G">
        <template #default="{ row }">
          {{ formatNumber(row['40G']) }}
        </template>
      </el-table-column>
      <el-table-column prop="100G" label="100G">
        <template #default="{ row }">
          {{ formatNumber(row['100G']) }}
        </template>
      </el-table-column>
      <el-table-column prop="200G" label="200G">
        <template #default="{ row }">
          {{ formatNumber(row['200G']) }}
        </template>
      </el-table-column>
      <el-table-column prop="400G" label="400G">
        <template #default="{ row }">
          {{ formatNumber(row['400G']) }}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  results: {
    type: Object,
    default: null
  }
})

const formattedResults = computed(() => {
  if (!props.results) return []
  
  return Object.entries(props.results).map(([type, costs]) => ({
    type,
    '40G': costs['40'],
    '100G': costs['100'],
    '200G': costs['200'],
    '400G': costs['400']
  }))
})

const formatNumber = (value) => {
  return value ? value.toFixed(2) : '-'
}

const searchQuery = ref('')

const filteredResults = computed(() => {
  if (!searchQuery.value) return formattedResults.value
  
  return formattedResults.value.filter(row => 
    row.type.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<style scoped>
.result-table {
  margin-bottom: 20px;
}

.header-with-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
