export const getDensityColor = (density: number): string => {
  if (density >= 15) return '#FF3366'; // High density
  if (density >= 5) return '#FFF903';  // Medium density
  return '#037CFE';                    // Low density
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};