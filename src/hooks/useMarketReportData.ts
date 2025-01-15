import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMarketReportData = (countyName: string, stateFp: string) => {
  return useQuery({
    queryKey: ['marketReport', countyName, stateFp],
    queryFn: async () => {
      // Get county data
      const { data: countyData, error: countyError } = await supabase
        .from('county_data')
        .select('*')
        .eq('STATEFP', stateFp)
        .eq('COUNTYNAME', countyName)
        .single();

      if (countyError) throw countyError;

      // Get state data for comparison
      const { data: stateData, error: stateError } = await supabase
        .from('state_data')
        .select('*')
        .eq('STATEFP', stateFp)
        .single();

      if (stateError) throw stateError;

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