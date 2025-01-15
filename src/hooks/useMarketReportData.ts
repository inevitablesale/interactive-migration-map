import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ComprehensiveMarketData } from "@/types/rankings";

export const useMarketReportData = (county: string | undefined, stateName: string | undefined) => {
  console.log('[Step 1] useMarketReportData called with:', { county, stateName });

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateName],
    queryFn: async () => {
      // Step 2: Validate inputs
      if (!stateName || !county) {
        console.log('[Step 2] Missing required parameters:', { county, stateName });
        return null;
      }

      // Step 3: Fetch the state FIPS code
      console.log('[Step 3] Fetching state FIPS code for:', stateName);
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
        console.error('[Step 4] No state FIPS found for:', stateName);
        return null;
      }

      console.log('[Step 5] Found state FIPS:', stateFips.STATEFP);

      // Step 6: Fetch the county FIPS code
      console.log('[Step 6] Fetching county rankings data for:', { county, stateFips: stateFips.STATEFP });
      const { data: countyFipsData, error: countyFipsError } = await supabase
        .from('county_rankings')
        .select('COUNTYFP')
        .eq('STATEFP', stateFips.STATEFP)
        .eq('COUNTYNAME', county)
        .single(); // Ensure only one row is returned

      if (countyFipsError) {
        console.error('[Error] Fetching county FIPS data:', countyFipsError.message);
        throw new Error('Error fetching county FIPS data');
      }

      if (!countyFipsData) {
        console.error('[Step 7] No county FIPS found for:', { county, stateName });
        return null;
      }

      console.log('[Step 8] Found county FIPS:', countyFipsData.COUNTYFP);

      // Step 9: Fetch top firms data
      console.log('[Step 9] Fetching top firms data for:', { stateFips: stateFips.STATEFP, countyFips: countyFipsData.COUNTYFP });
      const { data: topFirms, error: firmsError } = await supabase
        .from('canary_firms_data')
        .select('*') // Fetch all columns
        .eq('STATEFP', stateFips.STATEFP)
        .eq('COUNTYFP', countyFipsData.COUNTYFP)
        .order('employeeCount', { ascending: false, nullsLast: true })
        .limit(5); // Limit to top 5 firms

      if (firmsError) {
        console.error('[Error] Fetching top firms:', firmsError.message);
        throw new Error('Error fetching top firms');
      }

      console.log('[Step 10] Retrieved top firms:', topFirms?.length);

      // Step 11: Construct the final data object
      const transformedData: ComprehensiveMarketData = {
        top_firms: topFirms || [], // Include fetched top firms
      };

      console.log('[Step 11] Final transformed data:', transformedData);

      // Return the final data
      return transformedData;
    },
    enabled: !!stateName && !!county,
  });

  // Step 12: Log the query completion status
  const hasMarketData = !!marketData;
  console.log('[Step 12] Query complete:', { 
    hasData: hasMarketData, 
    isLoading, 
    hasError: !!error,
    firmsCount: marketData?.top_firms?.length 
  });

  // Return the query results
  return { marketData, isLoading, hasMarketData, error };
};
