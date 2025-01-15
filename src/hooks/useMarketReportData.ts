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
        .single();

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

      // Then, get the county data using the FIPS code
      const { data: countyData, error: countyError } = await supabase
        .from('county_data')
        .select('*')
        .eq('COUNTYNAME', county)
        .eq('STATEFP', stateData.fips_code)
        .single();

      if (countyError) {
        console.error('Error fetching county data:', countyError);
        toast.error('Error fetching county data');
        throw countyError;
      }

      // Get rankings data
      const { data: rankingData, error: rankingError } = await supabase
        .from('county_rankings')
        .select('*')
        .eq('COUNTYNAME', county)
        .eq('STATEFP', stateData.fips_code)
        .maybeSingle();

      if (rankingError) {
        console.error('Error fetching ranking data:', rankingError);
        // Don't throw here, we can still show other data
      }

      if (!countyData) {
        console.log('No county data found for:', { county, stateName });
        return null;
      }

      // Get firms data
      const { data: firmsData, error: firmsError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .eq('COUNTYNAME', county)
        .eq('STATEFP', stateData.fips_code);

      if (firmsError) {
        console.error('Error fetching firms data:', firmsError);
        // Don't throw, we can still show other data
      }

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
        Summary: firm.Summary
      })) : [];

      // Transform the data to match ComprehensiveMarketData type
      const transformedData: ComprehensiveMarketData = {
        total_population: countyData.B01001_001E,
        median_household_income: countyData.B19013_001E,
        median_gross_rent: countyData.B25064_001E,
        median_home_value: countyData.B25077_001E,
        employed_population: countyData.B23025_004E,
        private_sector_accountants: countyData.C24060_004E,
        public_sector_accountants: countyData.C24060_007E,
        firms_per_10k_population: rankingData?.firm_density || null,
        growth_rate_percentage: rankingData?.growth_rate || null,
        market_saturation_index: rankingData?.market_saturation || null,
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
        vacancy_rate: (countyData.B25002_003E / countyData.B25002_001E) * 100 || null,
        vacancy_rank: rankingData?.vacancy_rank || null,
        income_rank: rankingData?.income_rank || null,
        population_rank: rankingData?.population_rank || null,
        rent_rank: rankingData?.rent_rank || null,
        density_rank: rankingData?.density_rank || null,
        growth_rank: rankingData?.growth_rank || null,
        top_firms: transformedTopFirms,
      };

      console.log('Transformed market data:', transformedData); // Debug log

      return transformedData;
    },
    enabled: !!stateName && !!county,
  });

  const hasMarketData = !!marketData;
  console.log('Market data available:', hasMarketData, 'Top firms count:', marketData?.top_firms?.length); // Debug log

  return { marketData, isLoading, hasMarketData };
};