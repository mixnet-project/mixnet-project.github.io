// Chart configuration utilities
export function createChartOption({
  series,
  models,
  selectedBandwidth,
  topoTypes
}) {
  return {
    textStyle: {
      fontFamily: "'Inter', sans-serif"
    },
    tooltip: createTooltipConfig(),
    legend: createLegendConfig(topoTypes),
    grid: createGridConfig(),
    xAxis: createXAxisConfig(models),
    yAxis: createYAxisConfig(),
    series
  }
}

// Create tooltip configuration
function createTooltipConfig() {
  return {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    formatter: function(params) {
      let result = `Model: ${params[0].axisValue}<br/>`
      params.forEach(param => {
        if (param.value !== null) {
          result += `${param.seriesName}: ${param.value.toFixed(3)}<br/>`
        }
      })
      return result
    },
    textStyle: {
      fontFamily: "'Inter', sans-serif"
    }
  }
}

// Create legend configuration
function createLegendConfig(topoTypes) {
  return {
    data: topoTypes,
    top: 0,
    textStyle: {
      fontSize: 20,
      fontFamily: "'Inter', sans-serif"
    },
    itemGap: 30,
    padding: [5, 10]
  }
}

// Create grid configuration
function createGridConfig() {
  return {
    left: '10%',
    right: '4%',
    bottom: '15%',
    top: '15%',
    containLabel: true
  }
}

// Create X axis configuration
function createXAxisConfig(models) {
  return {
    type: 'category',
    data: models,
    nameLocation: 'middle',
    nameGap: 30,
    axisLabel: {
      interval: 0,
      fontSize: 22,
      fontFamily: "'Inter', sans-serif"
    }
  }
}

// Create Y axis configuration
function createYAxisConfig() {
  return {
    type: 'value',
    name: 'Normalized Perf. / Million Dollar',
    nameLocation: 'middle',
    nameGap: 65,
    nameTextStyle: {
      fontSize: 22,
      padding: [0, 0, 0, 30],
      fontFamily: "'Inter', sans-serif"
    },
    axisLabel: {
      fontSize: 20,
      fontFamily: "'Inter', sans-serif"
    }
  }
}
