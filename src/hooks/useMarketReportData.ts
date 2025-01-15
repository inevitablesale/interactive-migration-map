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

      // Fetch the state FIPS code
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

      // Fetch top firms data
      console.log('10. Fetching top firms data');
      const { data: firmsData, error: firmsError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .eq('STATEFP', parseInt(stateFips.STATEFP))
        .eq('COUNTYFP', parseInt(countyData.COUNTYFP))
        .order('employeeCount', { ascending: false })
        .limit(5);

      if (firmsError) {
        console.error('11. Error fetching top firms:', firmsError.message);
        throw new Error('Error fetching top firms');
      }

      // Transform firms data to match TopFirm interface
      const transformedFirms: TopFirm[] = (firmsData || []).map(firm => ({
        company_name: firm["Company Name"] || "",
        employee_count: firm.employeeCount || 0,
        follower_count: firm.followerCount || 0,
        follower_ratio: firm.followerCount && firm.employeeCount ? firm.followerCount / firm.employeeCount : 0,
        logoResolutionResult: firm.logoResolutionResult,
        originalCoverImage: firm.originalCoverImage,
        primarySubtitle: firm["Primary Subtitle"],
        employeeCountRangeLow: firm.employeeCountRangeLow,
        employeeCountRangeHigh: firm.employeeCountRangeHigh,
        foundedOn: firm.foundedOn?.toString(),
        specialities: firm.specialities,
        websiteUrl: firm.websiteUrl,
        Location: firm.Location,
        Summary: firm.Summary
      }));

      // Transform the data to match ComprehensiveMarketData interface
      const transformedData: ComprehensiveMarketData = {
        total_population: countyData.B01001_001E,
        median_household_income: countyData.B19013_001E,
        median_gross_rent: countyData.B25064_001E,
        median_home_value: countyData.B25077_001E,
        employed_population: countyData.B23025_004E,
        private_sector_accountants: countyData.C24060_004E,
        public_sector_accountants: countyData.C24060_007E,
        firms_per_10k_population: countyData.ESTAB ? (countyData.ESTAB / countyData.B01001_001E) * 10000 : null,
        growth_rate_percentage: countyData.MOVEDIN2022 && countyData.MOVEDIN2021 
          ? ((countyData.MOVEDIN2022 - countyData.MOVEDIN2021) / countyData.MOVEDIN2021) * 100 
          : null,
        market_saturation_index: countyData.B25002_003E && countyData.B25002_002E 
          ? (countyData.B25002_003E / countyData.B25002_002E) * 100 
          : null,
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
        vacancy_rate: countyData.B25002_003E && countyData.B25002_002E 
          ? (countyData.B25002_003E / countyData.B25002_002E) * 100 
          : null,
        top_firms: transformedFirms
      };

      console.log('12. Transformed data:', transformedData);
      return transformedData;
    },
    enabled: !!stateName && !!county,
    gcTime: 1000 * 60 * 60, // Cache for 1 hour
    staleTime: Infinity, // Data will never go stale
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