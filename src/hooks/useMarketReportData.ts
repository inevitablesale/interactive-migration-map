import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ComprehensiveMarketData, TopFirm } from "@/types/rankings";
import { toast } from "sonner";

export const useMarketReportData = (county: string | undefined, stateName: string | undefined) => {
  console.log('useMarketReportData called with:', { county, stateName }); // Debug log

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

      console.log('Found state FIPS:', stateData.fips_code); // Debug log

      // Get county data first
      const { data: countyData, error: countyError } = await supabase
        .from('county_data')
        .select('*')
        .eq('COUNTYNAME', county)
        .eq('STATEFP', stateData.fips_code)
        .maybeSingle();

      if (countyError) {
        console.error('Error fetching county data:', countyError);
        toast.error('Error fetching county data');
        throw countyError;
      }

      // Then get the rankings data
      const { data: rankingData, error: rankingError } = await supabase
        .from('county_rankings')
        .select('*')
        .eq('COUNTYNAME', county)
        .eq('STATEFP', stateData.fips_code.toString())
        .maybeSingle();

      if (rankingError) {
        console.error('Error fetching ranking data:', rankingError);
        toast.error('Error fetching ranking data');
        throw rankingError;
      }

      // Get firms data from canary_firms_data
      const { data: firmsData, error: firmsError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .eq('COUNTYNAME', county)
        .eq('STATEFP', parseInt(stateData.fips_code));

      if (firmsError) {
        console.error('Error fetching firms data:', firmsError);
        toast.error('Error fetching firms data');
        throw firmsError;
      }

      // Transform firms data to match TopFirm interface
      const transformedTopFirms: TopFirm[] = firmsData ? firmsData.map((firm: any) => ({
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
        websiteUrl: firm.websiteUrl,
        Location: firm.Location,
        Summary: firm.Summary
      })) : [];

      if (!countyData || !rankingData) {
        console.log('No data found for:', { county, stateName });
        return null;
      }

      // Transform the data to match ComprehensiveMarketData type
      const transformedData: ComprehensiveMarketData = {
        total_population: countyData.B01001_001E,
        median_household_income: countyData.B19013_001E,
        median_gross_rent: countyData.B25064_001E,
        median_home_value: countyData.B25077_001E,
        employed_population: countyData.B23025_004E,
        private_sector_accountants: countyData.C24060_004E,
        public_sector_accountants: countyData.C24060_007E,
        firms_per_10k_population: rankingData.firm_density,
        growth_rate_percentage: rankingData.growth_rate,
        market_saturation_index: rankingData.market_saturation,
        total_education_population: countyData.B15003_001E,
        bachelors_degree_holders: countyData.B15003_022E,
        masters_degree_holders: countyData.B15003_023E,
        doctorate_degree_holders: countyData.B15003_025E,
        payann: countyData.PAYANN,
        total_establishments: countyData.ESTAB,
        emp: countyData.EMP,
        public_to_private_ratio: countyData.C24060_007E && countyData.C24060_004E 
          ? countyData.C24060_007E / countyData.C24060_004E 
          : null,
        vacancy_rate: rankingData.market_saturation,
        vacancy_rank: rankingData.density_rank,
        income_rank: rankingData.density_rank,
        population_rank: rankingData.density_rank,
        rent_rank: rankingData.density_rank,
        density_rank: rankingData.density_rank,
        growth_rank: rankingData.growth_rank,
        top_firms: transformedTopFirms,
      };

      console.log('Final transformed market data:', transformedData);

      return transformedData;
    },
    enabled: !!stateName && !!county,
  });

  const hasMarketData = !!marketData;
  console.log('Market data available:', hasMarketData, 'Top firms count:', marketData?.top_firms?.length);

  return { marketData, isLoading, hasMarketData };
};