// Global configuration constants
export const MODELS = [
  'Mixtral 8*22B',
  'Mixtral 8*7B',
  'Qwen-MoE',
  'Llama-MoE'
]

export const BANDWIDTHS = [100, 200, 400, 800]

export const TOPOLOGY_TYPES = {
  FAT_TREE: 'Fat-tree',
  MIX_NET: 'MixNet',
  RAIL_OPTIMIZED: 'Rail-optimized',
  TOPO_OPT: 'TopoOpt'
}

export const TOPOLOGY_COLORS = {
  [TOPOLOGY_TYPES.FAT_TREE]: '#5470c6',
  [TOPOLOGY_TYPES.MIX_NET]: '#91cc75',
  [TOPOLOGY_TYPES.RAIL_OPTIMIZED]: '#fac858'
}

// Display name mapping for topology types
export const TOPOLOGY_DISPLAY_MAPPING = {
  'fattree': TOPOLOGY_TYPES.FAT_TREE,
  'mixnet': TOPOLOGY_TYPES.MIX_NET,
  'rail-optimized': TOPOLOGY_TYPES.RAIL_OPTIMIZED,
  'topoopt': TOPOLOGY_TYPES.TOPO_OPT
}

// Reverse mapping for topology types
export const REVERSE_TOPOLOGY_MAPPING = Object.entries(TOPOLOGY_DISPLAY_MAPPING)
  .reduce((acc, [key, value]) => ({...acc, [value]: key}), {}) 