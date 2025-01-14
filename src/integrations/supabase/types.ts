export interface ServiceDistribution {
  STATEFP: string;
  specialities: string;
  specialty_count: number;
  specialty_percentage: number;
}

export interface MarketOpportunityScore {
  STATEFP: string;
  COUNTYFP: string;
  COUNTYNAME: string;
  migration_score: number;
  business_density_score: number;
  service_coverage_score: number;
}

export interface Database {
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string | null;
          employee_count_max: number | null;
          employee_count_min: number | null;
          frequency: string;
          id: string;
          is_active: boolean | null;
          region: string | null;
          specialties: string[] | null;
          title: string;
          updated_at: string | null;
          user_id: string | null;
        };
      };
      buyer_profiles: {
        Row: {
          acquisition_purpose: string | null;
          buyer_name: string;
          contact_email: string;
          contact_phone: string | null;
          created_at: string | null;
          employee_count_max: number | null;
          employee_count_min: number | null;
          engagement_frequency: string | null;
          growth_priorities: string[] | null;
          id: string;
          preferred_communication: string | null;
          preferred_insights: string[] | null;
          price_max: number | null;
          price_min: number | null;
          retention_risk: string | null;
          revenue_max: number | null;
          revenue_min: number | null;
          service_lines: string[] | null;
          subscription_tier: string;
          target_geography: string[];
          updated_at: string | null;
          user_id: string | null;
        };
      };
    };
    Views: {
      county_rankings: {
        Row: {
          COUNTYNAME: string;
          STATEFP: string;
          COUNTYFP: string;
          total_population: number | null;
          median_household_income: number | null;
          median_gross_rent: number | null;
          median_home_value: number | null;
          employed_population: number | null;
          private_sector_accountants: number | null;
          public_sector_accountants: number | null;
          total_firms: number | null;
          bachelors_holders: number | null;
          masters_holders: number | null;
          doctorate_holders: number | null;
          education_population: number | null;
          total_commute_time: number | null;
          poverty_count: number | null;
          poverty_population: number | null;
          vacant_units: number | null;
          occupied_units: number | null;
          MOVEDIN2022: number | null;
          MOVEDIN2021: number | null;
          total_employees: number | null;
          total_payroll: number | null;
          population_rank: number | null;
          income_rank: number | null;
          rent_rank: number | null;
          home_value_rank: number | null;
          firm_density_rank: number | null;
          growth_rank: number | null;
          vacancy_rank: number | null;
          firms_per_10k: number | null;
          population_growth_rate: number | null;
          public_private_ratio: number | null;
          vacancy_rate: number | null;
          avg_accountant_payroll: number | null;
        };
        Relationships: [];
      };
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
          STATEFP: string;
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
          STATEFP: string;
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
          STATEFP: string;
          total_firms: number;
          avg_employee_count: number;
          market_concentration: number;
          competition_level: string;
        }>;
      };
    };
  };
}