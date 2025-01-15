// Global configuration constants
export const MODELS = [
  "Mixtral 8*22B",
  "Mixtral 8*7B",
  "Qwen-MoE",
  "Llama-MoE",
];

export const BANDWIDTHS = [100, 200, 400, 800];

export const TOPOLOGY_TYPES = {
  FAT_TREE: "Fat-tree",
  MIX_NET: "MixNet",
  RAIL_OPTIMIZED: "Rail-optimized",
  TOPO_OPT: "TopoOpt",
  RAIL_ONLY: "Rail-only",
};

// Define markers and colors for each topology
export const TOPOLOGY_STYLES = {
  [TOPOLOGY_TYPES.FAT_TREE]: {
    color: "#5470c6",
    marker: "circle",
  },
  [TOPOLOGY_TYPES.MIX_NET]: {
    color: "#91cc75",
    marker: "square",
  },
  [TOPOLOGY_TYPES.RAIL_OPTIMIZED]: {
    color: "#fac858",
    marker: "diamond",
  },
  [TOPOLOGY_TYPES.TOPO_OPT]: {
    color: "#ee6666",
    marker: "pin",
  },
  [TOPOLOGY_TYPES.RAIL_ONLY]: {
    color: "#73c0de",
    marker: ">",
  },
};

// For backward compatibility
export const TOPOLOGY_COLORS = Object.entries(TOPOLOGY_STYLES).reduce(
  (acc, [key, value]) => ({ ...acc, [key]: value.color }),
  {}
);

// Display name mapping for topology types
export const TOPOLOGY_DISPLAY_MAPPING = {
  fattree: TOPOLOGY_TYPES.FAT_TREE,
  mixnet: TOPOLOGY_TYPES.MIX_NET,
  "rail-optimized": TOPOLOGY_TYPES.RAIL_OPTIMIZED,
  topoopt: TOPOLOGY_TYPES.TOPO_OPT,
  "rail-only": TOPOLOGY_TYPES.RAIL_ONLY,
};

// Reverse mapping for topology types
export const REVERSE_TOPOLOGY_MAPPING = Object.entries(
  TOPOLOGY_DISPLAY_MAPPING
).reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});
