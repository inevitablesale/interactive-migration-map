interface MSAData {
  EMP?: number;
  PAYANN?: number;
  ESTAB?: number;
  B01001_001E?: number;
  B19013_001E?: number;
  B23025_004E?: number;
  B25077_001E?: number;
  B25064_001E?: number;
}

export const calculateGrowthScore = (msaData: MSAData): number => {
  if (!msaData) return 0;

  // Initialize component scores
  let employmentScore = 0;
  let businessDensityScore = 0;
  let wageScore = 0;
  let populationScore = 0;
  let incomeScore = 0;
  let laborForceScore = 0;

  // Calculate Employment Score (25%)
  if (msaData.EMP && msaData.B01001_001E) {
    employmentScore = (msaData.EMP / msaData.B01001_001E) * 100;
  }

  // Calculate Business Density Score (20%)
  if (msaData.ESTAB && msaData.B01001_001E) {
    businessDensityScore = (msaData.ESTAB / msaData.B01001_001E) * 10000;
  }

  // Calculate Wage Score (20%)
  if (msaData.PAYANN && msaData.EMP) {
    wageScore = msaData.PAYANN / msaData.EMP;
  }

  // Calculate Population Score (15%)
  if (msaData.B01001_001E) {
    populationScore = Math.log10(msaData.B01001_001E);
  }

  // Calculate Income Score (10%)
  if (msaData.B19013_001E) {
    incomeScore = msaData.B19013_001E / 1000;
  }

  // Calculate Labor Force Participation Score (10%)
  if (msaData.B23025_004E && msaData.B01001_001E) {
    laborForceScore = (msaData.B23025_004E / msaData.B01001_001E) * 100;
  }

  // Normalize each score to a 0-1 range (simplified for example)
  const normalizeScore = (score: number, max: number) => Math.min(score / max, 1);

  // Apply weights and combine scores
  const weightedScore = 
    normalizeScore(employmentScore, 50) * 0.25 +
    normalizeScore(businessDensityScore, 100) * 0.20 +
    normalizeScore(wageScore, 100000) * 0.20 +
    normalizeScore(populationScore, 7) * 0.15 +
    normalizeScore(incomeScore, 150) * 0.10 +
    normalizeScore(laborForceScore, 100) * 0.10;

  return weightedScore;
};

export const getColorFromScore = (score: number): string => {
  // Color scale from cool (blue) to warm (red)
  const colors = [
    '#0000ff', // Blue (low growth)
    '#4169e1',
    '#6495ed',
    '#87ceeb',
    '#ffd700',
    '#ffa500',
    '#ff6347',
    '#ff0000'  // Red (high growth)
  ];

  const index = Math.min(Math.floor(score * colors.length), colors.length - 1);
  return colors[index];
};

export const getHeightFromScore = (score: number): number => {
  // Base height plus growth-based addition
  const baseHeight = 20000;
  const maxAdditionalHeight = 80000;
  return baseHeight + (score * maxAdditionalHeight);
};