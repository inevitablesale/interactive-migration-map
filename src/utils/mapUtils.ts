export const getHeatmapColor = (score: number): string => {
  // Score should be between 0 and 1
  if (score >= 0.8) return '#037CFE';  // High score - blue
  if (score >= 0.6) return '#00FFE0';  // Good score - cyan
  if (score >= 0.4) return '#FFF903';  // Medium score - yellow
  if (score >= 0.2) return '#94EC0E';  // Low-medium score - green
  return '#FA0098';                    // Low score - pink
};

export const calculateBuyerScore = (state: any, allStates: any[]): number => {
  if (!state || !allStates.length) return 0;

  // Normalize metrics between 0 and 1
  const normalize = (value: number, max: number) => (value || 0) / (max || 1);

  // Get maximum values for normalization
  const maxIncome = Math.max(...allStates.map(s => s.B19013_001E || 0));
  const maxEmployed = Math.max(...allStates.map(s => s.B23025_004E || 0));
  const maxEstab = Math.max(...allStates.map(s => s.ESTAB || 0));

  // Calculate individual scores
  const incomeScore = normalize(state.B19013_001E, maxIncome);
  const employmentScore = normalize(state.B23025_004E, maxEmployed);
  const establishmentScore = normalize(state.ESTAB, maxEstab);

  // Weighted average (adjust weights as needed)
  const score = (
    incomeScore * 0.3 +
    employmentScore * 0.4 +
    establishmentScore * 0.3
  );

  return Math.min(Math.max(score, 0), 1); // Ensure score is between 0 and 1
};