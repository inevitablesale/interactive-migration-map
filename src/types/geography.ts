export type GeographicLevel = 'state' | 'region' | 'county';

export interface GeographicData {
  id: string;
  name: string;
  totalFirms: number;
  population: number;
  firmDensity: number;
  growthRate: number;
}