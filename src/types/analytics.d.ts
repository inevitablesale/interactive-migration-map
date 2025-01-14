export interface CountyRanking {
  statefp: string;
  countyfp: string;
  countyname: string;
  total_firms: number;
  population: number;
  firm_density: number;
  growth_rate: number;
  density_rank: number;
  growth_rank: number;
  state_density_avg: number;
  state_growth_avg: number;
}
