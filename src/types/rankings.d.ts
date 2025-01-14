export interface ComprehensiveMarketData {
  total_population: number | null;
  median_household_income: number | null;
  median_gross_rent: number | null;
  median_home_value: number | null;
  employed_population: number | null;
  private_sector_accountants: number | null;
  public_sector_accountants: number | null;
  firms_per_10k_population: number | null;
  growth_rate_percentage: number | null;
  market_saturation_index: number | null;
  total_education_population: number | null;
  bachelors_degree_holders: number | null;
  masters_degree_holders: number | null;
  doctorate_degree_holders: number | null;
  avg_accountant_payroll: number | null;
  public_to_private_ratio: number | null;
  avg_commute_time: number | null;
  commute_rank: number | null;
  poverty_rate: number | null;
  poverty_rank: number | null;
  vacancy_rate: number | null;
  vacancy_rank: number | null;
  income_rank: number | null;
  population_rank: number | null;
  rent_rank: number | null;
  density_rank: number | null;
  growth_rank: number | null;
  top_firms: Array<{
    company_name: string;
    employee_count: number;
    follower_count: number;
    follower_ratio: number;
  }>;
  state_avg_income: number | null;
  adjacent_counties: Array<string> | null;
}