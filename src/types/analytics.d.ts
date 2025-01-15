export interface EnhancedMarketScore {
  statefp: string;
  population_score: number;
  economic_score: number;
  business_density_score: number;
  employment_score: number;
  market_potential_score: number;
  total_score: number;
  density_rank: number;
  national_density_rank: number;
}

export interface MarketTrend {
  statefp: string;
  year_2020_moves: number;
  year_2021_moves: number;
  year_2022_moves: number;
  growth_rate: number;
  trend_direction: string;
  growth_rank: number;
  national_growth_rank: number;
}

export interface CompetitiveAnalysis {
  statefp: string;
  total_firms: number;
  avg_employee_count: number;
  market_concentration: number;
  competition_level: string;
}

export interface CountyRanking {
  avg_firms_per_10k: number;
  avg_growth_rate: number;
  avg_market_saturation: number;
  bachelors_holders: number;
  COUNTYFP: string;
  COUNTYNAME: string;
  doctorate_holders: number;
  education_population: number;
  employed_population: number;
  firm_density_rank: number;
  firms_per_10k: number;
  growth_rank: number;
  income_rank: number;
  market_saturation: number;
  market_saturation_rank: number;
  masters_holders: number;
  median_gross_rent: number;
  median_home_value: number;
  median_household_income: number;
  national_firm_density_rank: number;
  national_growth_rank: number;
  national_income_rank: number;
  national_market_saturation_rank: number;
  national_population_rank: number;
  national_rent_rank: number;
  national_vacancy_rank: number;
  population_growth_rate: number;
  population_rank: number;
  private_sector_accountants: number;
  public_sector_accountants: number;
  rent_rank: number;
  state_name: string;
  STATEFP: string;
  total_employees: number;
  total_establishments: number;
  total_payroll: number;
  total_population: number;
  vacancy_rank: number;
  vacancy_rate: number;
  density_rank: number;
}