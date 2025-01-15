import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ComprehensiveMarketData, TopFirm } from "@/types/rankings";

export const useMarketReportData = (county: string | undefined, stateName: string | undefined) => {
  console.log('1. useMarketReportData called with:', { county, stateName });

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateName],
    queryFn: async () => {
      if (!stateName || !county) {
        console.log('2. Missing required parameters:', { county, stateName });
        return null;
      }

      // First get the state FIPS code
      console.log('3. Getting state FIPS code for:', stateName);
      const { data: stateFips, error: stateFipsError } = await supabase
        .from('state_fips_codes')
        .select('STATEFP')
        .eq('state', stateName)
        .maybeSingle();

      if (stateFipsError) {
        console.error('4. Error fetching state FIPS:', stateFipsError.message);
        throw new Error('Error fetching state FIPS');
      }

      if (!stateFips) {
        console.error('5. No state FIPS found for:', stateName);
        return null;
      }

      console.log('6. Found state FIPS:', stateFips.STATEFP);

      // Get data from county_data view
      console.log('7. Fetching county rankings data for:', { county, stateFips: stateFips.STATEFP });
      const { data: countyData, error: countyError } = await supabase
        .from('county_data')
        .select('*')
        .eq('STATEFP', stateFips.STATEFP)
        .eq('COUNTYNAME', county)
        .maybeSingle();

      if (countyError) {
        console.error('8. Error fetching county data:', countyError.message);
        throw new Error('Error fetching county data');
      }

      if (!countyData) {
        console.error('9. No county data found for:', { county, stateName });
        return null;
      }

      console.log('10. Retrieved county data:', countyData);

      // Get firms data
      console.log('11. Fetching firms data');
      const { data: firmsData, error: firmsError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .eq('STATE', stateName)
        .eq('COUNTYNAME', county);

      if (firmsError) {
        console.error('12. Error fetching firms data:', firmsError.message);
        throw new Error('Error fetching firms data');
      }

      console.log('13. Retrieved firms data:', firmsData);

      // Transform firms data
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
        Summary: firm.Summary,
      })) : [];

      console.log('14. Transformed firms data. Count:', transformedTopFirms.length);

      // Transform the data using the county_data view
      const transformedData: ComprehensiveMarketData = {
        total_population: countyData.B01001_001E || null,
        median_household_income: countyData.B19013_001E || null,
        median_gross_rent: countyData.B25002_003E || null,
        median_home_value: countyData.B25001_001E || null,
        employed_population: countyData.B17001_001E || null,
        private_sector_accountants: countyData.B15003_001E || null,
        public_sector_accountants: countyData.B15003_022E || null,
        firms_per_10k_population: (countyData.ESTAB / countyData.B01001_001E) * 10000 || null,
        growth_rate_percentage: ((countyData.MOVEDIN2022 - countyData.MOVEDIN2021) / countyData.MOVEDIN2021) * 100 || null,
        market_saturation_index: (countyData.ESTAB / countyData.B23025_004E) * 100 || null,
        total_education_population: countyData.B15003_001E || null,
        bachelors_degree_holders: countyData.B15003_022E || null,
        masters_degree_holders: countyData.B15003_023E || null,
        doctorate_degree_holders: countyData.B15003_025E || null,
        payann: countyData.PAYANN || null,
        total_establishments: countyData.ESTAB || null,
        emp: countyData.EMP || null,
        public_to_private_ratio: countyData.B17001_002E / countyData.B17001_001E || null,
        vacancy_rate: (countyData.B25002_003E / countyData.B25002_002E) * 100 || null,
        vacancy_rank: null,
        income_rank: null,
        population_rank: null,
        rent_rank: null,
        density_rank: null,
        growth_rank: null,
        top_firms: transformedTopFirms,
      };

      console.log('14. Final transformed data:', transformedData);

      return transformedData;
    },
    enabled: !!stateName && !!county,
    staleTime: Infinity, // Data will never go stale
    cacheTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  const hasMarketData = !!marketData;
  console.log('15. Query complete:', { 
    hasData: hasMarketData, 
    isLoading, 
    hasError: !!error,
    firmsCount: marketData?.top_firms?.length 
  });

  return { marketData, isLoading, hasMarketData, error };
};