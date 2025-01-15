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
        .ilike('state', stateName)
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

      // Then, get the county data using the FIPS code
      const { data: rankingData, error: rankingError } = await supabase
        .from('county_data')
        .select('*')
        .ilike('COUNTYNAME', county)
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

      console.log('Raw ranking data:', rankingData); // Debug log

      // Get firms data from canary_firms_data
      const { data: firmsData, error: firmsError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .ilike('COUNTYNAME', county)
        .eq('STATEFP', parseInt(stateData.fips_code));

      if (firmsError) {
        console.error('Error fetching firms data:', firmsError);
        toast.error('Error fetching firms data');
        throw firmsError;
      }

      console.log('Raw firms data:', firmsData); // Debug log

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

      // Transform the data to match ComprehensiveMarketData type
      const transformedData: ComprehensiveMarketData = {
        total_population: rankingData.B01001_001E,
        median_household_income: rankingData.B19013_001E,
        median_gross_rent: rankingData.B25064_001E,
        median_home_value: rankingData.B25077_001E,
        employed_population: rankingData.B23025_004E,
        private_sector_accountants: rankingData.C24060_004E,
        public_sector_accountants: rankingData.C24060_007E,
        firms_per_10k_population: rankingData.firms_per_10k,
        growth_rate_percentage: rankingData.population_growth_rate,
        market_saturation_index: rankingData.firm_density_rank,
        total_education_population: rankingData.B15003_001E,
        bachelors_degree_holders: rankingData.B15003_022E,
        masters_degree_holders: rankingData.B15003_023E,
        doctorate_degree_holders: rankingData.B15003_025E,
        payann: rankingData.PAYANN,
        total_establishments: rankingData.ESTAB,
        emp: rankingData.EMP,
        public_to_private_ratio: rankingData.C24060_007E && rankingData.C24060_004E 
          ? rankingData.C24060_007E / rankingData.C24060_004E 
          : null,
        vacancy_rate: rankingData.B25002_003E && rankingData.B25002_002E
          ? (rankingData.B25002_003E / rankingData.B25002_002E) * 100
          : null,
        income_rank: rankingData.income_rank,
        population_rank: rankingData.population_rank,
        rent_rank: rankingData.rent_rank,
        density_rank: rankingData.density_rank,
        growth_rank: rankingData.growth_rank,
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