export interface ServiceDistribution {
  statefp: string;
  specialities: string;
  specialty_count: number;
  specialty_percentage: number;
}

export interface EnhancedMarketScore {
  statefp: string;
  population_score: number;
  economic_score: number;
  business_density_score: number;
  employment_score: number;
  market_potential_score: number;
  total_score: number;
}

export interface MarketTrend {
  statefp: string;
  year_2020_moves: number;
  year_2021_moves: number;
  year_2022_moves: number;
  growth_rate: number;
  trend_direction: string;
}

export interface CompetitiveAnalysis {
  statefp: string;
  total_firms: number;
  avg_employee_count: number;
  market_concentration: number;
  competition_level: string;
}

export interface MarketOpportunityScore {
  statefp: string;
  countyfp: string;
  countyname: string;
  migration_score: number;
  business_density_score: number;
  service_coverage_score: number;
}

export interface WeightedMarketOpportunityDetails {
  median_income: number;
  employment_rate: number;
  housing_value: number;
  education_rate: number;
  professional_services_rate: number;
  housing_occupancy: number;
}

export interface WeightedMarketOpportunity {
  statefp: string;
  countyfp: string;
  countyname: string;
  state_name: string;
  total_score: number;
  migration_score: number;
  economic_score: number;
  market_score: number;
  details: WeightedMarketOpportunityDetails;
}