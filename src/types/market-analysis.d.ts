export interface MarketSimilarityAnalysis {
  region_name: string;
  total_sold_firms: number;
  avg_deal_size: number;
  active_firms_count: number;
  market_density: number;
  similarity_score: number;
  potential_opportunities: number;
  projected_success_rate: number;
  key_factors: {
    median_income: number;
    labor_force: number;
    property_value: number;
    market_saturation: number;
    deal_velocity: number;
  };
}