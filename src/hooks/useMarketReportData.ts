import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ComprehensiveMarketData } from "@/types/rankings";

export const useMarketReportData = (county: string | undefined, state: string | undefined) => {
  console.log('useMarketReportData called with:', { county, state }); // Debug log

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

      console.log('State FIPS found:', data?.fips_code); // Debug log
      return data?.fips_code;
    },
    enabled: !!state,
  });

  // Query for market data
  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateFips],
    queryFn: async () => {
      if (!stateFips || !county) return null;

      console.log('Fetching market data for:', { county, stateFips }); // Debug log

      // Get the county data using RPC call to get_county_rankings
      const { data: countyData, error: countyError } = await supabase
        .rpc('get_county_rankings')
        .eq('statefp', stateFips)
        .eq('countyname', county)
        .maybeSingle();

      if (countyError) {
        console.error('Error fetching market data:', countyError);
        toast.error('Error fetching market data');
        throw countyError;
      }

      if (!countyData) {
        console.log('No county data found for:', { county, stateFips }); // Debug log
        toast.error('No data found for this location');
        return null;
      }

      console.log('County data found:', countyData); // Debug log

      // Fetch top firms data
      const { data: firmsData, error: firmsError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .eq('COUNTYNAME', county)
        .eq('STATEFP', parseInt(stateFips))
        .order('followerCount', { ascending: false });

      if (firmsError) {
        console.error('Error fetching firms data:', firmsError);
        toast.error('Error fetching firms data');
      }

      console.log('Firms data found:', firmsData?.length || 0, 'records'); // Debug log

      // Transform the data to match ComprehensiveMarketData type
      const marketData: ComprehensiveMarketData = {
        total_population: countyData.population,
        median_household_income: null, // Not available in get_county_rankings
        median_gross_rent: null,
        median_home_value: null,
        employed_population: null,
        private_sector_accountants: null,
        public_sector_accountants: null,
        firms_per_10k_population: countyData.firm_density,
        growth_rate_percentage: countyData.growth_rate,
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
        density_rank: countyData.density_rank,
        growth_rank: countyData.growth_rank,
        top_firms: firmsData?.map(firm => ({
          company_name: firm['Company Name'] || '',
          employee_count: firm.employeeCount || 0,
          follower_count: firm.followerCount || 0,
          follower_ratio: firm.followerCount / (firm.employeeCount || 1),
          specialities: firm.specialities || undefined,
          logoResolutionResult: firm.logoResolutionResult || undefined,
          originalCoverImage: firm.originalCoverImage || undefined,
          employeeCountRangeLow: firm.employeeCountRangeLow || undefined,
          employeeCountRangeHigh: firm.employeeCountRangeHigh || undefined,
          foundedOn: firm.foundedOn ? firm.foundedOn.toString() : undefined,
          websiteUrl: firm.websiteUrl || undefined,
          primarySubtitle: firm['Primary Subtitle'] || undefined
        })) || [],
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