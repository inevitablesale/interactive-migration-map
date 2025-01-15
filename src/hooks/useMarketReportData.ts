import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ComprehensiveMarketData } from "@/types/rankings";

export const useMarketReportData = (county: string | undefined, stateName: string | undefined) => {
  console.log('1. useMarketReportData called with:', { county, stateName });

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateName],
    queryFn: async () => {
      if (!stateName || !county) {
        console.log('2. Missing required parameters:', { county, stateName });
        return null;
      }

      // First, get the state FIPS code using the postal abbreviation
      console.log('3. Fetching state FIPS code for:', stateName);
      const { data: stateData, error: stateError } = await supabase
        .from('state_fips_codes')
        .select('fips_code')
        .eq('state', stateName)
        .maybeSingle();

      if (stateError) {
        console.error('4. Error fetching state FIPS:', stateError);
        throw stateError;
      }

      if (!stateData?.fips_code) {
        console.log('5. No state FIPS found for:', stateName);
        return null;
      }

      console.log('6. Found state FIPS:', stateData.fips_code);

      // Get county data from the county_rankings view
      console.log('7. Fetching county data for:', { county, stateFips: stateData.fips_code });
      const { data: countyData, error: countyError } = await supabase
        .from('county_rankings')
        .select('*')
        .eq('statefp', stateData.fips_code)
        .ilike('countyname', county)
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

      console.log('17. Transformed firms data. Count:', transformedTopFirms.length);

      // Transform the data using the county_rankings view data
      const transformedData: ComprehensiveMarketData = {
        total_population: countyData.population || null,
        median_household_income: null, // We'll need to add this from county_data if needed
        median_gross_rent: null,
        median_home_value: null,
        employed_population: null,
        private_sector_accountants: null,
        public_sector_accountants: null,
        firms_per_10k_population: countyData.firm_density || null,
        growth_rate_percentage: countyData.growth_rate || null,
        market_saturation_index: countyData.market_saturation || null,
        total_education_population: null,
        bachelors_degree_holders: null,
        masters_degree_holders: null,
        doctorate_degree_holders: null,
        payann: null,
        total_establishments: countyData.total_firms || null,
        emp: null,
        public_to_private_ratio: null,
        vacancy_rate: null,
        vacancy_rank: null,
        income_rank: null,
        population_rank: null,
        rent_rank: null,
        density_rank: countyData.density_rank || null,
        growth_rank: countyData.growth_rank || null,
        top_firms: transformedTopFirms,
      };

      console.log('18. Final transformed data:', {
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
        densityRank: transformedData.density_rank,
        growthRank: transformedData.growth_rank,
        firmsCount: transformedData.top_firms?.length
      });

      return transformedData;
    },
    enabled: !!stateName && !!county,
  });

  const hasMarketData = !!marketData;
  console.log('19. Query complete:', { 
    hasData: hasMarketData, 
    isLoading, 
    hasError: !!error,
    firmsCount: marketData?.top_firms?.length 
  });

  return { marketData, isLoading, hasMarketData, error };
};