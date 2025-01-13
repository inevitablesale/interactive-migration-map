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