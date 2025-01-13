export interface Report {
  id: string;
  title: string;
  description?: string;
  content: any;
  visibility: 'public' | 'private';
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  insights_query: string;
  chart_config?: any;
}

export interface PracticeAreaStats {
  name: string;
  firmCount: number;
  totalEmployees: number;
  avgEmployees: number;
  states: Set<string> | string[];
  marketCoverage: number;
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