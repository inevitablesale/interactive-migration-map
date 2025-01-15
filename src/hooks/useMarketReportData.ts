import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ComprehensiveMarketData, TopFirm } from "@/types/rankings";
import { toast } from "sonner";

export const useMarketReportData = (county: string | undefined, stateName: string | undefined) => {
  console.log('useMarketReportData called with:', { county, stateName });

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateName],
    queryFn: async () => {
      if (!stateName || !county) return null;

      console.log('Fetching market data for:', { county, stateName });

      // First, get the state FIPS code
      const { data: stateData, error: stateError } = await supabase
        .from('state_fips_codes')
        .select('STATEFP')
        .eq('state', stateName)
        .maybeSingle();

      if (stateError) {
        console.error('Error fetching state FIPS:', stateError);
        toast.error('Error fetching state data');
        throw stateError;
      }

      if (!stateData?.STATEFP) {
        console.log('No state FIPS found for:', stateName);
        return null;
      }

      console.log('Found state FIPS:', stateData.STATEFP);

      // Then, get the county data using the FIPS code - simplified query
     // Then, get the county data from the county_rankings table
const { data: countyData, error: countyError } = await supabase
  .from('county_rankings') // Use county_rankings table
  .select('*') // Fetch all columns
  .eq('COUNTYNAME', county) // Filter by COUNTYNAME
  .eq('STATEFP', stateData.STATEFP) // Filter by STATEFP
  .maybeSingle(); // Ensure a single result is returned


      if (countyError) {
        console.error('Error fetching county data:', countyError);
        toast.error('Error fetching county data');
        throw countyError;
      }

      if (!countyData) {
        console.log('No county data found for:', { county, stateName });
        return null;
      }

      console.log('Raw county data:', countyData);

      // Get firms data from canary_firms_data
      const { data: firmsData, error: firmsError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .eq('COUNTYNAME', county)
        .eq('STATEFP', stateData.STATEFP);

      if (firmsError) {
        console.error('Error fetching firms data:', firmsError);
        toast.error('Error fetching firms data');
        throw firmsError;
      }

      console.log('Raw firms data:', firmsData);

      // Transform firms data to match TopFirm interface
      const transformedTopFirms: TopFirm[] = firmsData ? firmsData.map((firm) => ({
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

      console.log('Transformed top firms:', transformedTopFirms);

      // Calculate firms per 10k population
      const firmsPerTenK = countyData.B01001_001E > 0 
        ? (countyData.ESTAB / countyData.B01001_001E) * 10000 
        : 0;

      // Calculate growth rate
      const growthRate = countyData.MOVEDIN2021 > 0
        ? ((countyData.MOVEDIN2022 - countyData.MOVEDIN2021) / countyData.MOVEDIN2021) * 100
        : 0;

      // Transform the data to match ComprehensiveMarketData type
      const transformedData: ComprehensiveMarketData = {
        total_population: countyData.B01001_001E,
        median_household_income: countyData.B19013_001E,
        median_gross_rent: countyData.B25064_001E,
        median_home_value: countyData.B25077_001E,
        employed_population: countyData.B23025_004E,
        private_sector_accountants: countyData.C24060_004E,
        public_sector_accountants: countyData.C24060_007E,
        firms_per_10k_population: firmsPerTenK,
        growth_rate_percentage: growthRate,
        market_saturation_index: null,
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
        vacancy_rate: null,
        vacancy_rank: null,
        income_rank: null,
        population_rank: null,
        rent_rank: null,
        density_rank: null,
        growth_rank: null,
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
