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

export interface EnhancedMarketScore {
  statefp: string;
  population_score: number;
  economic_score: number;
  business_density_score: number;
  employment_score: number;
  market_potential_score: number;
  total_score: number;
}

export interface AnalysisResult {
  stateId: string;
  marketScore: number;
  competitiveIndex: number;
  growthPotential: number;
  recommendations: string[];
}

export interface TargetCriteria {
  industryType: string;
  minEmployees: number;
  maxEmployees: number;
  targetMarket: string;
}

export interface MarketOpportunityScore {
  statefp: string;
  countyfp: string;
  countyname: string;
  migration_score: number;
  business_density_score: number;
  service_coverage_score: number;
}