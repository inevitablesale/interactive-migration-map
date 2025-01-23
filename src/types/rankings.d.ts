export interface StateRanking {
  statefp: string;
  total_firms: number;
  population: number;
  firm_density: number;
  growth_rate: number;
  density_rank: number;
  growth_rank: number;
  national_density_avg: number;
  national_growth_avg: number;
  market_saturation: number;
  market_saturation_rank: number;
  avg_payroll_per_firm: number;
  education_rate: number;
  migration_trend: number;
  median_income: number;
}

export interface MSARanking {
  msa: string;
  msa_name: string;
  total_firms: number;
  population: number;
  firm_density: number;
  growth_rate: number;
  density_rank: number;
  growth_rank: number;
  national_density_avg: number;
  national_growth_avg: number;
  regional_specialization: string;
  specialization_score: number;
  avg_payroll_per_firm: number;
  education_rate: number;
  migration_trend: number;
  median_income: number;
}

export interface ComprehensiveMarketData {
  total_population?: number;
  median_household_income?: number;
  median_gross_rent?: number;
  median_home_value?: number;
  employed_population?: number;
  private_sector_accountants?: number;
  public_sector_accountants?: number;
  firms_per_10k_population?: number;
  population_growth_rate?: number;
  market_saturation_index?: number;
  total_education_population?: number;
  bachelors_holders?: number;
  masters_holders?: number;
  doctorate_holders?: number;
  payann?: number;
  emp?: number;
  total_establishments?: number;
  avgSalaryPerEmployee?: number;
  vacancy_rate?: number;
  // State-level rankings
  vacancy_rank?: number;
  income_rank?: number;
  population_rank?: number;
  rent_rank?: number;
  growth_rank?: number;
  firm_density_rank?: number;
  density_rank?: number;
  state_rank?: number;
  // National-level rankings
  national_income_rank?: number;
  national_population_rank?: number;
  national_rent_rank?: number;
  national_firm_density_rank?: number;
  national_growth_rank?: number;
  national_vacancy_rank?: number;
  national_market_saturation_rank?: number;
  // Averages
  avg_firms_per_10k?: number;
  avg_growth_rate?: number;
  avg_market_saturation?: number;
}

export interface TopFirm {
  id?: string;
  "Company Name": string;
  "Primary Subtitle": string | null;
  Location: string | null;
  Summary: string | null;
  "Company ID": number;
  "Profile URL": string | null;
  employeeCount: number | null;
  specialities: string | null;
  employeeCountRangeLow: number | null;
  employeeCountRangeHigh: number | null;
  followerCount: number | null;
  description: string | null;
  websiteUrl: string | null;
  foundedOn: number | null;
  latitude: number | null;
  longitude: number | null;
  "Block FIPS": string | null;
  "State Name": string | null;
  STATE: string | null;
  STATEFP: number | null;
  COUNTYFP: number | null;
  COUNTYNAME: string | null;
  PLACEFP: string | null;
  PLACENS: string | null;
  PLACENAME: string | null;
  originalCoverImage: string | null;
  logoResolutionResult: string | null;
  status: string | null;
  notes: string | null;
}
