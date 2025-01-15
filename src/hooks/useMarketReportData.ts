import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ComprehensiveMarketData } from "@/types/rankings";

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
        .ilike('state', stateName)
        .maybeSingle();

      if (stateError) {
        console.error('Error fetching state FIPS:', stateError);
        throw stateError;
      }

      if (!stateData?.fips_code) {
        console.log('No state FIPS found for:', stateName);
        return null;
      }

      console.log('Found state FIPS:', stateData.fips_code); // Debug log

      // Get both rankings and detailed data
      const { data: countyData, error: countyError } = await supabase
        .from('county_data')
        .select(`
          *,
          rankings:county_rankings!inner(
            density_rank,
            growth_rank,
            firm_density,
            growth_rate,
            market_saturation,
            total_firms
          )
        `)
        .ilike('COUNTYNAME', county)
        .eq('STATEFP', stateData.fips_code)
        .maybeSingle();

      if (countyError) {
        console.error('Error fetching market data:', countyError);
        throw countyError;
      }

      if (!countyData) {
        console.log('No county data found for:', { county, stateName });
        return null;
      }

      // Get firms data
      const { data: firmsData, error: firmsError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .ilike('COUNTYNAME', county)
        .eq('STATEFP', parseInt(stateData.fips_code));

      if (firmsError) {
        console.error('Error fetching firms data:', firmsError);
        throw firmsError;
      }

      // Transform firms data
      const transformedTopFirms = firmsData ? firmsData.map((firm: any) => ({
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

      // Calculate vacancy rate
      const vacancyRate = countyData.B25002_003E && countyData.B25002_002E
        ? (countyData.B25002_003E / countyData.B25002_002E) * 100
        : null;

      // Transform the data
      const transformedData: ComprehensiveMarketData = {
        total_population: countyData.B01001_001E,
        median_household_income: countyData.B19013_001E,
        median_gross_rent: countyData.B25064_001E,
        median_home_value: countyData.B25077_001E,
        employed_population: countyData.B23025_004E,
        private_sector_accountants: countyData.C24060_004E,
        public_sector_accountants: countyData.C24060_007E,
        firms_per_10k_population: countyData.rankings.firm_density,
        growth_rate_percentage: countyData.rankings.growth_rate,
        market_saturation_index: countyData.rankings.market_saturation,
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
        vacancy_rate: vacancyRate,
        density_rank: countyData.rankings.density_rank,
        growth_rank: countyData.rankings.growth_rank,
        top_firms: transformedTopFirms,
      };

      console.log('Final transformed market data:', transformedData); // Debug log

      return transformedData;
    },
    enabled: !!stateName && !!county,
  });

  const hasMarketData = !!marketData;
  console.log('Market data available:', hasMarketData, 'Top firms count:', marketData?.top_firms?.length); // Debug log

  return { marketData, isLoading, hasMarketData };
};