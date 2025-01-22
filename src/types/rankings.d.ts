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
  total_establishments?: number;
  emp?: number;
  avgSalaryPerEmployee?: number;
  vacancy_rate?: number;
  vacancy_rank?: number;
  income_rank?: number;
  population_rank?: number;
  rent_rank?: number;
  density_rank?: number;
  growth_rank?: number;
  firm_density_rank?: number;
  national_rank?: number;
  state_rank?: number;
  top_firms?: TopFirm[];
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
  specialities?: string;
  websiteUrl?: string;
  Location?: string;
  Summary?: string;
  foundedOn?: string;
}