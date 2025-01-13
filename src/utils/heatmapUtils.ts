export const getDensityColor = (density: number) => {
  if (density >= 0.1) return '#ea384c'; // High density (red)
  if (density >= 0.05) return '#FEF7CD'; // Medium density (yellow)
  return '#F2FCE2'; // Low density (green)
};

export const getGrowthColor = (growthRate: number) => {
  if (growthRate >= 0.1) return '#F2FCE2'; // High growth (green)
  if (growthRate >= 0) return '#FEF7CD'; // Moderate growth (yellow)
  return '#ea384c'; // Declining growth (red)
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(Math.round(num));
};