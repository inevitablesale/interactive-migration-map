import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ComprehensiveMarketData } from "@/types/rankings";

export const useMarketReportData = (county: string | undefined, state: string | undefined) => {
  // Query for state FIPS code
  const { data: stateFips } = useQuery({
    queryKey: ['stateFips', state],
    queryFn: async () => {
      if (!state) return null;

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
    },
    enabled: !!state,
  });

  // Query for market data
  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateFips],
    queryFn: async () => {
      if (!stateFips || !county) return null;

      const { data, error } = await supabase.rpc(
        'get_comprehensive_county_data',
        {
          p_county_name: county,
          p_state_fp: stateFips
        }
      );

      if (error) {
        console.error('Error fetching market data:', error);
        toast.error('Error fetching market data');
        throw error;
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        toast.error('No data found for this location');
        return null;
      }

      const firstRow = data[0];
      const marketData = {
        ...firstRow,
        top_firms: Array.isArray(firstRow?.top_firms) ? firstRow.top_firms : [],
        adjacent_counties: Array.isArray(firstRow?.adjacent_counties) ? firstRow.adjacent_counties : []
      } as ComprehensiveMarketData;

      return marketData;
    },
    enabled: !!stateFips && !!county,
  });

  const hasMarketData = !!marketData;

  return { marketData, isLoading, hasMarketData };
};