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

      return {
        countyData: {
          ...countyData,
          firms_per_10k_population: countyData?.firm_density || 0,
          growth_rate_percentage: countyData?.growth_rate || 0,
          market_saturation_index: countyData?.market_saturation || 0,
          total_education_population: countyData?.education_population || 0,
          bachelors_degree_holders: countyData?.bachelors_holders || 0,
          masters_degree_holders: countyData?.masters_holders || 0,
          doctorate_degree_holders: countyData?.doctorate_holders || 0,
          top_firms: firms || []
        },
        stateData,
        firms: firms || []
      };
    }
  });
};