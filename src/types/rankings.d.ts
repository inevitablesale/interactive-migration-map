export interface TopFirm {
  company_name: string;
  employee_count: number;
  follower_count: number;
  follower_ratio: number;
  specialities?: string;
  logoResolutionResult?: string;
  originalCoverImage?: string;
  employeeCountRangeLow?: number;
  employeeCountRangeHigh?: number;
  foundedOn?: number;
  websiteUrl?: string;
  primarySubtitle?: string;
}

export interface ComprehensiveMarketData {
  total_population: number;
  median_household_income: number;
  median_gross_rent: number;
  median_home_value: number;
  employed_population: number;
  private_sector_accountants: number;
  public_sector_accountants: number;
  firms_per_10k_population: number;
  growth_rate_percentage: number;
  market_saturation_index: number | null;
  total_education_population: number;
  bachelors_degree_holders: number;
  masters_degree_holders: number;
  doctorate_degree_holders: number;
  avg_accountant_payroll: number;
  public_to_private_ratio: number;
  avg_commute_time: number | null;
  commute_rank: number | null;
  poverty_rate: number | null;
  poverty_rank: number | null;
  vacancy_rate: number;
  vacancy_rank: number;
  income_rank: number;
  population_rank: number;
  rent_rank: number;
  density_rank: number;
  growth_rank: number;
  top_firms: TopFirm[];
  state_avg_income: number | null;
  adjacent_counties: any | null;
}