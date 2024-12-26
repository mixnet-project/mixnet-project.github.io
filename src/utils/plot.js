export function calculatePerfCost(performanceData, networkingCost) {
  // Check if data exists
  if (!performanceData || !networkingCost) {
    console.error('Missing performance data or networking cost');
    return null;
  }

  const result = {};

  // Iterate through each network type
  performanceData.forEach(row => {
    const type = row.type;
    result[type] = [];

    // Calculate performance/cost points for each rate
    ['40G', '100G', '200G', '400G'].forEach((rate, index) => {
      const rateNum = rate.replace('G', '');
      result[type].push({
        performance: row[rate] / networkingCost[type.toLowerCase()][rateNum]
      });
    });
  });

  return result;
}
