import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMarketReportData = (countyName: string, state: string) => {
  return useQuery({
    queryKey: ['marketReport', countyName, state],
    queryFn: async () => {
      // First get the state FIPS code
      const { data: stateFips, error: stateFipsError } = await supabase
        .from('state_fips_codes')
        .select('STATEFP')
        .eq('state', state)
        .single();

      if (stateFipsError) throw stateFipsError;
      if (!stateFips) throw new Error('State not found');

      // Then get the state data using the FIPS code
      const { data: stateData, error: stateError } = await supabase
        .from('state_data')
        .select('*')
        .eq('STATEFP', stateFips.STATEFP)
        .maybeSingle();

      if (stateError) throw stateError;
      if (!stateData) throw new Error('State data not found');

      // Get county data
      const { data: countyData, error: countyError } = await supabase
        .from('county_data')
        .select('*')
        .eq('COUNTYNAME', countyName)
        .eq('STATEFP', stateFips.STATEFP)
        .maybeSingle();

      if (countyError) throw countyError;
      if (!countyData) throw new Error('County data not found');

      // Get county rankings using the existing function
      const { data: rankings, error: rankingsError } = await supabase
        .rpc('get_county_rankings')
        .eq('statefp', stateFips.STATEFP)
        .eq('countyfp', countyData.COUNTYFP)
        .maybeSingle();

      if (rankingsError) throw rankingsError;

      // Get firms in county
      const { data: firms, error: firmsError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .eq('STATEFP', parseInt(stateFips.STATEFP))
        .eq('COUNTYNAME', countyName);

      if (firmsError) throw firmsError;

      // Calculate average salary per employee if both payann and emp exist
      const avgSalaryPerEmployee = stateData.PAYANN && stateData.EMP 
        ? stateData.PAYANN / stateData.EMP 
        : null;

      // Transform the data to match our ComprehensiveMarketData type
      const transformedCountyData = {
        ...countyData,
        total_population: countyData?.B01001_001E || 0,
        median_household_income: countyData?.B19013_001E || 0,
        median_gross_rent: countyData?.B25064_001E || 0,
        median_home_value: countyData?.B25077_001E || 0,
        employed_population: countyData?.B23025_004E || 0,
        vacancy_rate: countyData?.B25002_003E && countyData?.B25002_002E 
          ? (countyData.B25002_003E / countyData.B25002_002E) * 100 
          : 0,
        firms_per_10k_population: rankings?.firm_density || 0,
        growth_rate_percentage: rankings?.growth_rate || 0,
        market_saturation_index: rankings?.market_saturation || 0,
        total_education_population: countyData?.B15003_001E || 0,
        bachelors_degree_holders: countyData?.B15003_022E || 0,
        masters_degree_holders: countyData?.B15003_023E || 0,
        doctorate_degree_holders: countyData?.B15003_025E || 0,
        private_sector_accountants: countyData?.C24060_004E || 0,
        public_sector_accountants: countyData?.C24060_007E || 0,
        payann: stateData?.PAYANN || 0,
        emp: stateData?.EMP || 0,
        total_establishments: stateData?.ESTAB || 0,
        avgSalaryPerEmployee,
        population_rank: rankings?.density_rank,
        income_rank: rankings?.income_rank,
        rent_rank: rankings?.rent_rank,
        vacancy_rank: rankings?.vacancy_rank,
        growth_rank: rankings?.growth_rank,
        top_firms: firms?.map(firm => ({
          company_name: firm["Company Name"],
          employee_count: firm.employeeCount,
          follower_count: firm.followerCount,
          follower_ratio: firm.followerCount / (firm.employeeCount || 1),
          logoResolutionResult: firm.logoResolutionResult,
          originalCoverImage: firm.originalCoverImage,
          primarySubtitle: firm["Primary Subtitle"],
          employeeCountRangeLow: firm.employeeCountRangeLow,
          employeeCountRangeHigh: firm.employeeCountRangeHigh,
          specialities: firm.specialities,
          websiteUrl: firm.websiteUrl,
          Location: firm.Location,
          Summary: firm.Summary
        })) || []
      };

      // Add console logs for debugging
      console.log('Market Data:', transformedCountyData);
      console.log('State Data:', stateData);
      console.log('County Data:', countyData);
      console.log('Rankings Data:', rankings);

      return {
        countyData: transformedCountyData,
        stateData,
        firms: firms || []
      };
    }
  });
};