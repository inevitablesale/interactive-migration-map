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

        return data?.fips_code;
      } catch (error) {
        console.error('Error in stateFips query:', error);
        throw error;
      }
    },
  });

  // Query for market data
  const { data: marketData, isLoading } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateFips],
    queryFn: async () => {
      if (!stateFips) return null;
      
      console.log('Fetching data for:', { county, stateFips });
      
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

        if (!rawData || rawData.length === 0) {
          toast.error('No data found for this location');
          return null;
        }

        const marketData = rawData[0] as unknown as ComprehensiveMarketData;
        
        return {
          ...marketData,
          top_firms: Array.isArray(marketData.top_firms) ? marketData.top_firms : [],
          adjacent_counties: Array.isArray(marketData.adjacent_counties) ? marketData.adjacent_counties : []
        };
      } catch (error) {
        console.error('Error in market data query:', error);
        toast.error('Failed to fetch market data');
        throw error;
      }
    },
    enabled: !!stateFips,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return { marketData, isLoading };
};