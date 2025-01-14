export interface BuyerProfile {
  id: string;
  user_id: string;
  subscription_tier: 'free' | 'paid';
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