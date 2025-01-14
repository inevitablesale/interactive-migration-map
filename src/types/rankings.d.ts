export interface ComprehensiveMarketData {
  total_population?: number;
  median_household_income?: number;
  income_rank?: number;
  median_gross_rent?: number;
  rent_rank?: number;
  vacancy_rate?: number;
  vacancy_rank?: number;
  firms_per_10k_population?: number;
  density_rank?: number;
  growth_rate_percentage?: number;
  growth_rank?: number;
  top_firms?: TopFirm[];
  private_sector_accountants?: number;
  public_sector_accountants?: number;
  public_to_private_ratio?: number;
  avg_accountant_payroll?: number;
  employed_population?: number;
  total_education_population?: number;
  bachelors_degree_holders?: number;
  masters_degree_holders?: number;
  doctorate_degree_holders?: number;
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