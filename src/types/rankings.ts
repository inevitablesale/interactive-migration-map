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
}