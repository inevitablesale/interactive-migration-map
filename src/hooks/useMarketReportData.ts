import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ComprehensiveMarketData } from "@/types/rankings";

export const useMarketReportData = (county: string | undefined, stateName: string | undefined) => {
  console.log('1. useMarketReportData called with:', { county, stateName }); // Debug log

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateName],
    queryFn: async () => {
      if (!stateName || !county) {
        console.log('2. Missing required parameters:', { county, stateName });
        return null;
      }

      console.log('3. Fetching state FIPS code for:', stateName); // Debug log

      // First, get the state FIPS code
      const { data: stateData, error: stateError } = await supabase
        .from('state_fips_codes')
        .select('fips_code')
        .ilike('state', stateName)
        .maybeSingle();

      if (stateError) {
        console.error('4. Error fetching state FIPS:', stateError);
        throw stateError;
      }

      if (!stateData?.fips_code) {
        console.log('5. No state FIPS found for:', stateName);
        return null;
      }

      console.log('6. Found state FIPS:', stateData.fips_code); // Debug log

      // Get county data
      console.log('7. Fetching county data for:', { county, stateFips: stateData.fips_code });
      const { data: countyData, error: countyError } = await supabase
        .from('county_data')
        .select('*')
        .eq('STATEFP', stateData.fips_code)
        .ilike('COUNTYNAME', county)
        .maybeSingle();

      if (countyError) {
        console.error('8. Error fetching county data:', countyError);
        throw countyError;
      }

      if (!countyData) {
        console.error('9. No county data found for:', { county, stateFips: stateData.fips_code });
        return null;
      }

      console.log('10. Retrieved county data:', countyData);

      // Get rankings data using the function
      console.log('11. Fetching rankings data');
      const { data: rankingsData, error: rankingsError } = await supabase
        .rpc('get_county_rankings', {})
        .eq('statefp', stateData.fips_code)
        .eq('countyname', county)
        .maybeSingle();

      if (rankingsError) {
        console.error('12. Error fetching rankings:', rankingsError);
        throw rankingsError;
      }

      console.log('13. Retrieved rankings data:', rankingsData);

      // Get firms data
      console.log('14. Fetching firms data');
      const { data: firmsData, error: firmsError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .eq('STATEFP', parseInt(stateData.fips_code))
        .ilike('COUNTYNAME', county);

      if (firmsError) {
        console.error('15. Error fetching firms data:', firmsError);
        throw firmsError;
      }

      console.log('16. Retrieved firms data:', firmsData);

      // Calculate vacancy rate
      const vacancyRate = countyData.B25002_003E && countyData.B25002_002E
        ? (countyData.B25002_003E / countyData.B25002_002E) * 100
        : null;

      console.log('17. Calculated vacancy rate:', vacancyRate);

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

      console.log('18. Transformed firms data. Count:', transformedTopFirms.length);

      // Transform the data
      const transformedData: ComprehensiveMarketData = {
        total_population: countyData.B01001_001E || null,
        median_household_income: countyData.B19013_001E || null,
        median_gross_rent: countyData.B25064_001E || null,
        median_home_value: countyData.B25077_001E || null,
        employed_population: countyData.B23025_004E || null,
        private_sector_accountants: countyData.C24060_004E || null,
        public_sector_accountants: countyData.C24060_007E || null,
        firms_per_10k_population: rankingsData?.firm_density || null,
        growth_rate_percentage: rankingsData?.growth_rate || null,
        market_saturation_index: rankingsData?.market_saturation || null,
        total_education_population: countyData.B15003_001E || null,
        bachelors_degree_holders: countyData.B15003_022E || null,
        masters_degree_holders: countyData.B15003_023E || null,
        doctorate_degree_holders: countyData.B15003_025E || null,
        payann: countyData.PAYANN || null,
        total_establishments: countyData.ESTAB || null,
        emp: countyData.EMP || null,
        public_to_private_ratio: countyData.C24060_007E && countyData.C24060_004E 
          ? countyData.C24060_007E / countyData.C24060_004E 
          : null,
        vacancy_rate: vacancyRate,
        vacancy_rank: null,
        income_rank: null,
        population_rank: null,
        rent_rank: null,
        density_rank: rankingsData?.density_rank || null,
        growth_rank: rankingsData?.growth_rank || null,
        top_firms: transformedTopFirms,
      };

      console.log('19. Final transformed data:', {
        population: transformedData.total_population,
        income: transformedData.median_household_income,
        rent: transformedData.median_gross_rent,
        homeValue: transformedData.median_home_value,
        employedPop: transformedData.employed_population,
        privateAccountants: transformedData.private_sector_accountants,
        publicAccountants: transformedData.public_sector_accountants,
        firmsPer10k: transformedData.firms_per_10k_population,
        growthRate: transformedData.growth_rate_percentage,
        marketSaturation: transformedData.market_saturation_index,
        educationPop: transformedData.total_education_population,
        bachelors: transformedData.bachelors_degree_holders,
        masters: transformedData.masters_degree_holders,
        doctorate: transformedData.doctorate_degree_holders,
        payann: transformedData.payann,
        establishments: transformedData.total_establishments,
        emp: transformedData.emp,
        publicPrivateRatio: transformedData.public_to_private_ratio,
        vacancyRate: transformedData.vacancy_rate,
        densityRank: transformedData.density_rank,
        growthRank: transformedData.growth_rank,
        firmsCount: transformedData.top_firms?.length
      });

      return transformedData;
    },
    enabled: !!stateName && !!county,
  });

  const hasMarketData = !!marketData;
  console.log('20. Query complete:', { 
    hasData: hasMarketData, 
    isLoading, 
    hasError: !!error,
    firmsCount: marketData?.top_firms?.length 
  });

  return { marketData, isLoading, hasMarketData, error };
};