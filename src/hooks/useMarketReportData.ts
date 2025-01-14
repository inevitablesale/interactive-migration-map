import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ComprehensiveMarketData } from "@/types/rankings";
import { toast } from "sonner";

export const useMarketReportData = (county: string | undefined, stateName: string | undefined) => {
  console.log('useMarketReportData called with:', { county, stateName }); // Debug log

  // Query for market data using county_rankings view
  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateName],
    queryFn: async () => {
      if (!stateName || !county) return null;

      console.log('Fetching market data for:', { county, stateName }); // Debug log

      // First, get the state FIPS code
      const { data: stateData, error: stateError } = await supabase
        .from('state_fips_codes')
        .select('fips_code')
        .eq('state', stateName)
        .maybeSingle();

      if (stateError) {
        console.error('Error fetching state FIPS:', stateError);
        toast.error('Error fetching state data');
        throw stateError;
      }

      if (!stateData?.fips_code) {
        console.log('No state FIPS found for:', stateName);
        return null;
      }

      // Then, get the county data using the FIPS code
      const { data: rankingData, error: rankingError } = await supabase
        .from('county_rankings')
        .select('*')
        .eq('COUNTYNAME', county)
        .eq('STATEFP', stateData.fips_code)
        .maybeSingle();

      if (rankingError) {
        console.error('Error fetching market data:', rankingError);
        toast.error('Error fetching market data');
        throw rankingError;
      }

      if (!rankingData) {
        console.log('No county data found for:', { county, stateName }); // Debug log
        return null;
      }

      // Get the top firms data
      const { data: firmsData, error: firmsError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .in('Company ID', rankingData.top_firms as number[]);

      if (firmsError) {
        console.error('Error fetching firms data:', firmsError);
      }

      // Transform firms data to match the TopFirm type
      const transformedFirms = (firmsData || []).map(firm => ({
        company_name: firm['Company Name'] || '',
        employee_count: firm.employeeCount || 0,
        follower_count: firm.followerCount || 0,
        follower_ratio: firm.followerCount && firm.employeeCount ? firm.followerCount / firm.employeeCount : 0,
        logoResolutionResult: firm.logoResolutionResult,
        originalCoverImage: firm.originalCoverImage,
        primarySubtitle: firm['Primary Subtitle'],
        employeeCountRangeLow: firm.employeeCountRangeLow,
        employeeCountRangeHigh: firm.employeeCountRangeHigh,
        foundedOn: firm.foundedOn?.toString(),
        specialities: firm.specialities,
        websiteUrl: firm.websiteUrl
      }));

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
        population_rank: rankingData.population_rank,
        rent_rank: null,
        density_rank: rankingData.firm_density_rank,
        growth_rank: rankingData.growth_rank,
        top_firms: transformedFirms,
        state_avg_income: null,
        adjacent_counties: null
      };

      return transformedData;
    },
    enabled: !!stateName && !!county,
  });

  const hasMarketData = !!marketData;

  return { marketData, isLoading, hasMarketData };
};