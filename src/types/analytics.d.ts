export interface CountyRanking {
  statefp: string;
  countyfp: string;
  countyname: text;
  total_firms: bigint;
  population: integer;
  firm_density: double;
  growth_rate: double;
  density_rank: bigint;
  growth_rank: bigint;
  state_density_avg: double;
  state_growth_avg: double;
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