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

  // Query for market data
  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateFips],
    queryFn: async () => {
      if (!stateFips || !county) return null;

      // First get the county data
      const { data: countyData, error: countyError } = await supabase
        .from('county_data')
        .select('*')
        .eq('COUNTYNAME', county)
        .eq('STATEFP', stateFips)
        .maybeSingle();

      if (countyError) {
        console.error('Error fetching market data:', countyError);
        toast.error('Error fetching market data');
        throw countyError;
      }

      if (!countyData) {
        toast.error('No data found for this location');
        return null;
      }

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

      const topFirms = (firmsData || []).map(firm => ({
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
      }));

      // Transform the data to match ComprehensiveMarketData type
      const marketData: ComprehensiveMarketData = {
        total_population: countyData.B01001_001E,
        median_household_income: countyData.B19013_001E,
        median_gross_rent: countyData.B25064_001E,
        median_home_value: countyData.B25077_001E,
        employed_population: countyData.EMP,
        private_sector_accountants: countyData.C24060_004E,
        public_sector_accountants: countyData.C24060_007E,
        firms_per_10k_population: countyData.ESTAB ? (countyData.ESTAB / countyData.B01001_001E) * 10000 : null,
        growth_rate_percentage: countyData.population_growth_rate,
        market_saturation_index: null,
        total_education_population: countyData.B15003_001E,
        bachelors_degree_holders: countyData.B15003_022E,
        masters_degree_holders: countyData.B15003_023E,
        doctorate_degree_holders: countyData.B15003_025E,
        avg_accountant_payroll: countyData.PAYANN,
        public_to_private_ratio: countyData.C24060_007E / (countyData.C24060_004E || 1),
        avg_commute_time: countyData.B08303_001E ? countyData.B08303_001E / (12 * 20) : null,
        commute_rank: null,
        poverty_rate: countyData.B17001_002E && countyData.B17001_001E 
          ? (countyData.B17001_002E / countyData.B17001_001E) * 100 
          : null,
        poverty_rank: null,
        vacancy_rate: countyData.vacancy_rate,
        vacancy_rank: countyData.vacancy_rank,
        income_rank: countyData.income_rank,
        population_rank: countyData.population_rank,
        rent_rank: countyData.rent_rank,
        density_rank: countyData.firm_density_rank,
        growth_rank: countyData.growth_rank,
        top_firms: topFirms,
        state_avg_income: null,
        adjacent_counties: null
      };

      console.log('Market Data:', marketData);
      return marketData;
    },
    enabled: !!stateFips && !!county,
  });

  const hasMarketData = !!marketData;

  return { marketData, isLoading, hasMarketData };
};