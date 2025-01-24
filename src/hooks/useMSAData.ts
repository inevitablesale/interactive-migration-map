import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { MSAData } from "@/types/map";

// Explicitly define the types to prevent deep recursion
interface MSACrosswalk {
  MSA: string;
  msa_name: string;
  STATEFP: string;
}

export const useMSAData = (stateFp: string) => {
  return useQuery({
    queryKey: ['msaData', stateFp],
    queryFn: async () => {
      // First, get the list of MSAs for the state
      const { data: msaList, error: msaError } = await supabase
        .from('msa_state_crosswalk')
        .select('MSA, msa_name, STATEFP')
        .eq('STATEFP', stateFp);

      if (msaError) throw msaError;

      // Then get the metrics for each MSA
      const msaData = await Promise.all(
        (msaList as MSACrosswalk[]).map(async (msa) => {
          const { data: metrics, error: metricsError } = await supabase
            .from('region_data')
            .select('EMP, PAYANN, ESTAB, B01001_001E, B19013_001E, B23025_004E')
            .eq('MSA', msa.MSA)
            .single();

          if (metricsError) throw metricsError;

          // Combine the MSA info with its metrics
          return {
            ...msa,
            ...metrics,
          } as MSAData;
        })
      );

      return msaData;
    },
  });
};