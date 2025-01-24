import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { MSAData } from "@/types/map";

interface MSACrosswalk {
  MSA: string;
  msa_name: string;
  STATEFP: string;
}

interface MSAMetrics {
  MSA: string;
  metrics: Omit<MSAData, 'MSA'>;
}

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
        (msaList as MSACrosswalk[]).map(async (msa) => {
          const { data: metrics, error: metricsError } = await supabase
            .from('region_data')
            .select('*')
            .eq('MSA', msa.MSA)
            .single();

          if (metricsError) throw metricsError;

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