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
  bachelors_degree_holders?: number;
  masters_degree_holders?: number;
  doctorate_degree_holders?: number;
  avg_accountant_payroll?: number;
  total_establishments?: number;
  public_to_private_ratio?: number;
  vacancy_rate?: number;
  vacancy_rank?: number;
  income_rank?: number;
  population_rank?: number;
  rent_rank?: number;
  density_rank?: number;
  growth_rank?: number;
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
  foundedOn?: string;
  specialities?: string;
  websiteUrl?: string;
}