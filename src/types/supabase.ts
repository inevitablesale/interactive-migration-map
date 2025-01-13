export interface ServiceDistribution {
  statefp: string;
  specialities: string;
  specialty_count: number;
  specialty_percentage: number;
}

export interface MarketOpportunityScore {
  statefp: string;
  countyfp: string;
  countyname: string;
  migration_score: number;
  business_density_score: number;
  service_coverage_score: number;
}

// Add Database interface to extend Supabase types
export interface Database {
  public: {
    Tables: {
      // ... existing tables
    };
    Functions: {
      get_market_opportunities: {
        Args: Record<string, never>;
        Returns: MarketOpportunityScore[];
      };
      get_service_distribution: {
        Args: Record<string, never>;
        Returns: ServiceDistribution[];
      };
      get_enhanced_market_scores: {
        Args: Record<string, never>;
        Returns: Array<{
          statefp: string;
          population_score: number;
          economic_score: number;
          business_density_score: number;
          employment_score: number;
          market_potential_score: number;
          total_score: number;
        }>;
      };
      get_market_trends: {
        Args: Record<string, never>;
        Returns: Array<{
          statefp: string;
          year_2020_moves: number;
          year_2021_moves: number;
          year_2022_moves: number;
          growth_rate: number;
          trend_direction: string;
        }>;
      };
      get_competitive_analysis: {
        Args: Record<string, never>;
        Returns: Array<{
          statefp: string;
          total_firms: number;
          avg_employee_count: number;
          market_concentration: number;
          competition_level: string;
        }>;
      };
    };
  };
}
