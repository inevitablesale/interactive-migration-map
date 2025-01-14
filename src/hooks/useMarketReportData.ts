import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ComprehensiveMarketData } from "@/types/rankings";
import { toast } from "sonner";

export const useMarketReportData = (county: string | undefined, stateFips: string | undefined) => {
  console.log('useMarketReportData called with:', { county, stateFips }); // Debug log

  // Query for market data using county_rankings view
  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateFips],
    queryFn: async () => {
      if (!stateFips || !county) return null;

      console.log('Fetching market data for:', { county, stateFips }); // Debug log

      const { data: rankingData, error: rankingError } = await supabase
        .from('county_rankings')
        .select('*')
        .eq('COUNTYNAME', county)
        .eq('statefp', stateFips)
        .maybeSingle();

      if (rankingError) {
        console.error('Error fetching market data:', rankingError);
        toast.error('Error fetching market data');
        throw rankingError;
      }

      if (!rankingData) {
        console.log('No county data found for:', { county, stateFips }); // Debug log
        return null;
      }

      // Transform the data to match ComprehensiveMarketData type
      const transformedData: ComprehensiveMarketData = {
        total_population: rankingData.B01001_001E,
        median_household_income: null,
        median_gross_rent: null,
        median_home_value: null,
        employed_population: null,
        private_sector_accountants: null,
        public_sector_accountants: null,
        firms_per_10k_population: rankingData.firms_per_10k,
        growth_rate_percentage: rankingData.population_growth_rate,
        market_saturation_index: null,
        total_education_population: null,
        bachelors_degree_holders: null,
        masters_degree_holders: null,
        doctorate_degree_holders: null,
        avg_accountant_payroll: null,
        public_to_private_ratio: null,
        avg_commute_time: null,
        commute_rank: null,
        poverty_rate: null,
        poverty_rank: null,
        vacancy_rate: null,
        vacancy_rank: null,
        income_rank: null,
        population_rank: null,
        rent_rank: null,
        density_rank: rankingData.firm_density_rank,
        growth_rank: rankingData.growth_rank,
        top_firms: [],
        state_avg_income: null,
        adjacent_counties: null
      };

      return transformedData;
    },
    enabled: !!stateFips && !!county,
  });

  const hasMarketData = !!marketData;

  return { marketData, isLoading, hasMarketData };
};