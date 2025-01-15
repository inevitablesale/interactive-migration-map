import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ComprehensiveMarketData } from "@/types/rankings";

export const useMarketReportData = (county: string | undefined, stateName: string | undefined) => {
  console.log('[Step 1] useMarketReportData called with:', { county, stateName });

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateName],
    queryFn: async () => {
      // Step 1: Validate inputs
      if (!stateName || !county) {
        console.log('[Step 1] Missing required parameters:', { county, stateName });
        return null;
      }

      console.log('[Step 1] Inputs validated. Proceeding to Step 2...');

      // Step 2: Fetch the state FIPS code
      console.log('[Step 2] Starting fetch for state FIPS code');
      const { data: stateFips, error: stateFipsError } = await supabase
        .from('state_fips_codes')
        .select('STATEFP')
        .eq('state', stateName)
        .maybeSingle();

      if (stateFipsError) {
        console.error('[Error] Fetching state FIPS:', stateFipsError.message);
        throw new Error('Error fetching state FIPS');
      }

      if (!stateFips) {
        console.error('[Step 2] No state FIPS found for:', stateName);
        return null;
      }

      console.log('[Step 2] Fetched state FIPS:', stateFips.STATEFP);

      // Placeholder return for the next steps
      return { stateFips: stateFips.STATEFP };
    },
    enabled: !!stateName && !!county, // Only enable the query if inputs are valid
  });

  // Log query completion status
  const hasMarketData = !!marketData;
  console.log('[Query Complete] Query finished:', { 
    hasData: hasMarketData, 
    isLoading, 
    hasError: !!error,
    marketData,
  });

  return { marketData, isLoading, error };
};
