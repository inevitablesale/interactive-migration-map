export interface ValueMetric {
  county_name: string;
  state_name: string;
  median_income: number;
  median_home_value: number;
  total_firms: number;
  avg_revenue: number;
  growth_potential: number;
  state_rank?: number;
  national_rank?: number;
}

export interface MarketGrowthMetric {
  county_name: string;
  state: string;
  population_growth: number;
  growth_rate_percentage: number;
  total_movedin_2022: number;
  total_movedin_2021: number;
  total_movedin_2020: number;
  total_moves: number;
  state_rank?: number;
  national_rank?: number;
}

export interface CompetitiveMarketMetric {
  COUNTYNAME: string;
  "State Name": string;
  employeeCount: number;
  followerCount: number;
  market_saturation?: number;
  state_rank?: number;
  national_rank?: number;
}

export interface UnderservedRegionMetric {
  county_name: string;
  state_name: string;
  total_establishments: number;
  population: number;
  firms_per_10k_population: number;
  recent_movers: number;
  market_status: string;
  opportunity_status: string;
  state_rank?: number;
  national_rank?: number;
  median_income?: number;
}

export interface EmergingTalentMarket {
  county_name: string;
  state_name: string;
  education_rate_percent: number;
  total_educated: bigint;
  education_growth_rate: number;
  median_age: number;
  state_rank?: number;
  national_rank?: number;
}

export interface FutureSaturationRisk {
  county_name: string;
  state_name: string;
  current_firm_density: number;
  projected_firm_density: number;
  firm_growth_rate: number;
  population_growth_rate: number;
  state_rank?: number;
  national_rank?: number;
}