export interface StateRanking {
  statefp: string;
  total_firms: number;
  population: number;
  firm_density: number;
  growth_rate: number;
  density_rank: number;
  growth_rank: number;
  national_density_avg: number;
  national_growth_avg: number;
  market_saturation: number;
  market_saturation_rank: number;
  avg_payroll_per_firm: number;
  education_rate: number;
  migration_trend: number;
  median_income: number;
}

export interface MSARanking {
  msa: string;
  msa_name: string;
  total_firms: number;
  population: number;
  firm_density: number;
  growth_rate: number;
  density_rank: number;
  growth_rank: number;
  national_density_avg: number;
  national_growth_avg: number;
  regional_specialization: string;
  specialization_score: number;
  avg_payroll_per_firm: number;
  education_rate: number;
  migration_trend: number;
  median_income: number;
}