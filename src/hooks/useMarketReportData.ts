import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ComprehensiveMarketData } from "@/types/rankings";

export const useMarketReportData = (county: string | undefined, state: string | undefined) => {
  // Query for state FIPS code
  const { data: stateFips } = useQuery({
    queryKey: ['stateFips', state],
    queryFn: async () => {
      if (!state) return null;

      const { data, error } = await supabase
        .from('state_fips_codes')
        .select('fips_code')
        .eq('state', state)
        .maybeSingle();

      if (error) {
        console.error('Error fetching state FIPS:', error);
        toast.error('Error fetching state data');
        throw error;
      }

      return data?.fips_code;
    },
    enabled: !!state,
  });

  // Query for market data from the materialized view
  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateFips],
    queryFn: async () => {
      if (!stateFips || !county) return null;

      const { data, error } = await supabase
        .from('county_rankings')
        .select('*')
        .eq('COUNTYNAME', county)
        .eq('STATEFP', stateFips)
        .maybeSingle();

      if (error) {
        console.error('Error fetching market data:', error);
        toast.error('Error fetching market data');
        throw error;
      }

      if (!data) {
        toast.error('No data found for this location');
        return null;
      }

      // Transform the data to match ComprehensiveMarketData type
      const marketData: ComprehensiveMarketData = {
        total_population: data.total_population,
        median_household_income: data.median_household_income,
        median_gross_rent: data.median_gross_rent,
        median_home_value: data.median_home_value,
        employed_population: data.employed_population,
        private_sector_accountants: data.private_sector_accountants,
        public_sector_accountants: data.public_sector_accountants,
        firms_per_10k_population: data.firms_per_10k,
        growth_rate_percentage: data.population_growth_rate,
        market_saturation_index: null,
        total_education_population: data.education_population,
        bachelors_degree_holders: data.bachelors_holders,
        masters_degree_holders: data.masters_holders,
        doctorate_degree_holders: data.doctorate_holders,
        avg_accountant_payroll: null,
        public_to_private_ratio: data.public_private_ratio,
        avg_commute_time: data.total_commute_time ? data.total_commute_time / (12 * 20) : null,
        commute_rank: null,
        poverty_rate: data.poverty_count && data.poverty_population 
          ? (data.poverty_count / data.poverty_population) * 100 
          : null,
        poverty_rank: null,
        vacancy_rate: data.vacancy_rate,
        vacancy_rank: data.vacancy_rank,
        income_rank: data.income_rank,
        population_rank: data.population_rank,
        rent_rank: data.rent_rank,
        density_rank: data.firm_density_rank,
        growth_rank: data.growth_rank,
        top_firms: null,
        state_avg_income: null,
        adjacent_counties: null
      };

      return marketData;
    },
    enabled: !!stateFips && !!county,
  });

  const hasMarketData = !!marketData;

  return { marketData, isLoading, hasMarketData };
};