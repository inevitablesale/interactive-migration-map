import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMSAData = (stateFp: string) => {
  return useQuery({
    queryKey: ['msaData', stateFp],
    queryFn: async () => {
      const { data: msaList, error: msaError } = await supabase
        .from('msa_state_crosswalk')
        .select('MSA, msa_name, STATEFP')
        .eq('STATEFP', stateFp);

      if (msaError) throw msaError;

      const msaData = await Promise.all(
        msaList.map(async (msa) => {
          const { data: metrics, error: metricsError } = await supabase
            .from('region_data')
            .select('*')
            .eq('MSA', msa.MSA)
            .single();

          if (metricsError) throw metricsError;

          return {
            ...msa,
            ...metrics,
          };
        })
      );

      return msaData;
    },
  });
};