// Data processing utilities
export function processPerformanceData(rawData) {
  if (!rawData) return []
  
  const lines = rawData.split('\n').filter(line => line.trim())
  if (lines.length === 0) throw new Error('CSV file is empty')

  const headers = lines[0].split(',').map(h => h.trim())
  return parsePerformanceLines(lines.slice(1), headers)
}

// Parse CSV lines into structured data
function parsePerformanceLines(lines, headers) {
  return lines.reduce((acc, line) => {
    const values = line.split(',').map(v => v.trim())
    if (values.length !== headers.length) return acc

    const parsedData = parseLineData(values, headers)
    if (parsedData) acc.push(parsedData)
    return acc
  }, [])
}

// Other data processing functions... 