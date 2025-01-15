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

      // Then, get the county data from the county_rankings table
      const { data: countyData, error: countyError } = await supabase
        .from('county_rankings')
        .select('*')
        .eq('COUNTYNAME', countyName)
        .eq('STATEFP', stateFips.STATEFP)
        .maybeSingle();

      if (countyError) throw countyError;

      // Get firms in county
      const { data: firms, error: firmsError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .eq('STATEFP', parseInt(stateFips.STATEFP))
        .eq('COUNTYNAME', countyName);

      if (firmsError) throw firmsError;

      // Transform the data to match our ComprehensiveMarketData type
      const transformedCountyData = {
        ...countyData,
        firms_per_10k_population: countyData?.firms_per_10k || 0,
        growth_rate_percentage: countyData?.growth_rate || 0,
        market_saturation_index: countyData?.market_saturation || 0,
        total_education_population: countyData?.education_population || 0,
        bachelors_degree_holders: countyData?.bachelors_holders || 0,
        masters_degree_holders: countyData?.masters_holders || 0,
        doctorate_degree_holders: countyData?.doctorate_holders || 0,
        payann: stateData?.PAYANN || 0,
        emp: stateData?.EMP || 0,
        public_to_private_ratio: countyData?.public_to_private_ratio || 0,
        density_rank: countyData?.firm_density_rank || 0,
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

      return {
        countyData: transformedCountyData,
        stateData,
        firms: firms || []
      };
    }
  });
};