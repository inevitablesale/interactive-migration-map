import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMSAData = (stateFp: string | undefined) => {
  return useQuery({
    queryKey: ['msaData', stateFp],
    queryFn: async () => {
      if (!stateFp) return null;

      // Get MSA data for the state
      const { data: msaData, error: msaError } = await supabase
        .from('msa_state_crosswalk')
        .select('MSA, msa_name, STATEFP')
        .eq('STATEFP', stateFp);

      if (msaError) throw msaError;

      // Get county data for each MSA
      const msaPromises = msaData.map(async (msa) => {
        const { data: countyData, error: countyError } = await supabase
          .from('county_data')
          .select('*')
          .eq('STATEFP', msa.STATEFP);

        if (countyError) throw countyError;

        return {
          MSA: msa.MSA,
          msa_name: msa.msa_name,
          counties: countyData || []
        };
      });

      const msaResults = await Promise.all(msaPromises);
      return msaResults;
    },
    enabled: !!stateFp
  });
};