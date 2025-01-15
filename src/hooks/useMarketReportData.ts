import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMarketReportData = (countyName: string, stateFp: string) => {
  return useQuery({
    queryKey: ['marketReport', countyName, stateFp],
    queryFn: async () => {
      // First get the state data
      const { data: stateData, error: stateError } = await supabase
        .from('state_data')
        .select('*')
        .eq('STATEFP', stateFp)
        .single();

      if (stateError) throw stateError;

      // Then, get the county data from the county_rankings table
      const { data: countyData, error: countyError } = await supabase
        .from('county_rankings') // Use county_rankings table
        .select('*') // Fetch all columns
        .eq('COUNTYNAME', countyName) // Filter by COUNTYNAME
        .eq('STATEFP', stateData.STATEFP) // Filter by STATEFP
        .maybeSingle(); // Ensure a single result is returned

      if (countyError) throw countyError;

      // Get firms in county
      const { data: firms, error: firmsError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .eq('STATEFP', parseInt(stateFp))
        .eq('COUNTYNAME', countyName);

      if (firmsError) throw firmsError;

      return {
        countyData,
        stateData,
        firms: firms || []
      };
    }
  });
};