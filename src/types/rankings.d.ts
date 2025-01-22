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

export interface TopFirm {
  company_name: string;
  employee_count: number;
  follower_count: number;
  follower_ratio: number;
  logoResolutionResult?: string;
  originalCoverImage?: string;
  primarySubtitle?: string;
  employeeCountRangeLow?: number;
  employeeCountRangeHigh?: number;
  foundedOn?: string;
  specialities?: string;
  websiteUrl?: string;
  Location?: string;
  Summary?: string;
}

export interface ComprehensiveMarketData {
  total_population?: number;
  median_household_income?: number;
  median_gross_rent?: number;
  median_home_value?: number;
  employed_population?: number;
  private_sector_accountants?: number;
  public_sector_accountants?: number;
  firms_per_10k_population?: number;
  growth_rate_percentage?: number;
  market_saturation_index?: number;
  total_education_population?: number;
  bachelors_holders?: number;
  masters_holders?: number;
  doctorate_holders?: number;
  payann?: number;
  emp?: number;
  total_establishments?: number;
  avgSalaryPerEmployee?: number;
  vacancy_rate?: number;
  vacancy_rank?: number;
  income_rank?: number;
  population_rank?: number;
  rent_rank?: number;
  growth_rank?: number;
  firm_density_rank?: number;
  density_rank?: number;
  state_rank?: number;
  national_rank?: number;
  top_firms?: TopFirm[] | null;
}