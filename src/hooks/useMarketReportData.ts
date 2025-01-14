import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ComprehensiveMarketData } from "@/types/rankings";

export const useMarketReportData = (county: string | undefined, state: string | undefined) => {
  // Query for state FIPS code
  const { data: stateFips } = useQuery({
    queryKey: ['stateFips', state],
    queryFn: async () => {
      try {
        console.log('Fetching FIPS code for state:', state);
        const { data, error } = await supabase
          .from('state_fips_codes')
          .select('fips_code')
          .eq('state', state)
          .maybeSingle();

        if (error) {
          console.error('Error fetching state FIPS:', error);
          toast.error('Error fetching state data');
          throw error;
        }

        console.log('Retrieved FIPS code:', data?.fips_code);
        return data?.fips_code;
      } catch (error) {
        console.error('Error in stateFips query:', error);
        throw error;
      }
    },
    enabled: !!state,
  });

  // Query for market data
  const { data: marketData, isLoading } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateFips],
    queryFn: async () => {
      if (!stateFips) return null;
      
      console.log('Fetching market data for:', { county, stateFips });
      
      try {
        const { data: rawData, error } = await supabase.rpc(
          'get_comprehensive_county_data',
          {
            p_county_name: county,
            p_state_fp: stateFips
          }
        );

        if (error) {
          console.error('Error fetching comprehensive market data:', error);
          toast.error('Error fetching market data');
          throw error;
        }

        // Safely handle the response
        if (!rawData) {
          console.log('No data returned from query');
          toast.error('No data found for this location');
          return null;
        }

        // Log the raw data for debugging
        console.log('Raw market data received:', rawData);

        // Ensure we're working with an array and it has data
        const marketData = Array.isArray(rawData) && rawData.length > 0 
          ? {
              ...rawData[0],
              top_firms: Array.isArray(rawData[0]?.top_firms) ? rawData[0].top_firms : [],
              adjacent_counties: Array.isArray(rawData[0]?.adjacent_counties) ? rawData[0].adjacent_counties : []
            } as ComprehensiveMarketData
          : null;

        if (!marketData) {
          console.log('No valid market data found');
          toast.error('No data found for this location');
          return null;
        }

        return marketData;
      } catch (error) {
        console.error('Error in market data query:', error);
        toast.error('Failed to fetch market data');
        throw error;
      }
    },
    enabled: !!stateFips && !!county,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });

  return { marketData, isLoading };
};