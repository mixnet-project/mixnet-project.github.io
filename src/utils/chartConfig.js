// Chart configuration utilities
const CHART_FONTS = {
  TITLE: 22,
  AXIS_LABEL: 20,
  LEGEND: 20,
  TOOLTIP: 14,
};

const CHART_STYLES = {
  fontFamily: "'Inter', sans-serif",
  padding: {
    axis: [0, 0, 0, 30],
  },
  grid: {
    left: "10%",
    right: "4%",
    bottom: "15%",
    top: "15%",
    containLabel: true,
  },
};

// Create base chart configuration
function createBaseChartOption(title = "") {
  return {
    textStyle: {
      fontFamily: CHART_STYLES.fontFamily,
    },
    title: title
      ? {
          text: title,
          textStyle: {
            fontSize: CHART_FONTS.TITLE,
          },
        }
      : undefined,
    grid: CHART_STYLES.grid,
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      textStyle: {
        fontSize: CHART_FONTS.TOOLTIP,
        fontFamily: CHART_STYLES.fontFamily,
      },
    },
    legend: {
      top: 0,
      textStyle: {
        fontSize: CHART_FONTS.LEGEND,
        fontFamily: CHART_STYLES.fontFamily,
      },
    },
  };
}

// Create axis configuration
function createAxisConfig({ name, data = null, isValue = false }) {
  return {
    type: isValue ? "value" : "category",
    name,
    data,
    nameLocation: "middle",
    nameGap: isValue ? 65 : 40,
    nameTextStyle: {
      fontSize: CHART_FONTS.TITLE,
      padding: CHART_STYLES.padding.axis,
      fontFamily: CHART_STYLES.fontFamily,
    },
    axisLabel: {
      fontSize: CHART_FONTS.AXIS_LABEL,
      fontFamily: CHART_STYLES.fontFamily,
    },
  };
}

// Create chart option for performance/cost analysis
export function createChartOption({
  series,
  models,
  selectedBandwidth,
  topoTypes,
}) {
  const baseOption = createBaseChartOption();
  return {
    ...baseOption,
    xAxis: createAxisConfig({
      name: "Model",
      data: models,
    }),
    yAxis: createAxisConfig({
      name: "Normalized Perf. / Million Dollar",
      isValue: true,
    }),
    series,
  };
}

// Create chart option for networking cost analysis
export function createNetworkingCostOption({ series, serverScales }) {
  const baseOption = createBaseChartOption();
  return {
    ...baseOption,
    xAxis: createAxisConfig({
      name: "Number of GPUs",
      data: serverScales.map((scale) => scale * 8),
      formatter: (value) => value.toLocaleString(),
    }),
    yAxis: createAxisConfig({
      name: "Networking Cost (Million $)",
      isValue: true,
    }),
    tooltip: {
      ...baseOption.tooltip,
      formatter: function (params) {
        let result = `Number of GPUs: ${params[0].axisValue.toLocaleString()}<br/>`;
        params.forEach((param) => {
          if (param.value != null) {
            result += `${param.seriesName}: $${param.value.toFixed(2)}M<br/>`;
          }
        });
        return result;
      },
    },
    series,
  };
}

export { CHART_FONTS, CHART_STYLES };
