import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ComprehensiveMarketData } from "@/types/rankings";

export const useMarketReportData = (county: string | undefined, state: string | undefined) => {
  console.log('useMarketReportData hook called with:', { county, state });

  // Query for state FIPS code
  const { data: stateFips } = useQuery({
    queryKey: ['stateFips', state],
    queryFn: async () => {
      try {
        console.log('Starting FIPS code fetch for state:', state);
        
        if (!state) {
          console.warn('No state provided for FIPS lookup');
          return null;
        }

        console.log('Making Supabase request for state_fips_codes...');
        const { data, error } = await supabase
          .from('state_fips_codes')
          .select('fips_code')
          .eq('state', state)
          .maybeSingle();

        if (error) {
          console.error('Error fetching state FIPS:', error);
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          toast.error('Error fetching state data');
          throw error;
        }

        console.log('FIPS code response:', data);
        console.log('Retrieved FIPS code:', data?.fips_code);
        return data?.fips_code;
      } catch (error) {
        console.error('Error in stateFips query:', error);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        throw error;
      }
    },
    enabled: !!state,
  });

  // Query for market data
  const { data: marketData, isLoading } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateFips],
    queryFn: async () => {
      console.log('Market data query starting with params:', { county, stateFips });
      
      if (!stateFips) {
        console.warn('No stateFips available, skipping market data fetch');
        return null;
      }

      if (!county) {
        console.warn('No county provided, skipping market data fetch');
        return null;
      }
      
      try {
        console.log('Making RPC call to get_comprehensive_county_data with params:', {
          p_county_name: county,
          p_state_fp: stateFips
        });

        const { data: rawData, error } = await supabase.rpc(
          'get_comprehensive_county_data',
          {
            p_county_name: county,
            p_state_fp: stateFips
          }
        );

        if (error) {
          console.error('Error fetching comprehensive market data:', error);
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          toast.error('Error fetching market data');
          throw error;
        }

        console.log('Raw response from RPC:', rawData);

        // Detailed data validation logging
        if (!rawData) {
          console.warn('RPC returned null or undefined data');
          toast.error('No data found for this location');
          return null;
        }

        if (!Array.isArray(rawData)) {
          console.warn('RPC returned non-array data:', typeof rawData);
          console.log('Actual data structure:', rawData);
          toast.error('Invalid data format received');
          return null;
        }

        if (rawData.length === 0) {
          console.warn('RPC returned empty array');
          toast.error('No data found for this location');
          return null;
        }

        console.log('First row of raw data:', rawData[0]);

        // Validate specific fields
        const firstRow = rawData[0];
        console.log('Validating top_firms:', {
          exists: 'top_firms' in firstRow,
          type: typeof firstRow.top_firms,
          isArray: Array.isArray(firstRow.top_firms)
        });

        console.log('Validating adjacent_counties:', {
          exists: 'adjacent_counties' in firstRow,
          type: typeof firstRow.adjacent_counties,
          isArray: Array.isArray(firstRow.adjacent_counties)
        });

        const marketData = {
          ...firstRow,
          top_firms: Array.isArray(firstRow?.top_firms) ? firstRow.top_firms : [],
          adjacent_counties: Array.isArray(firstRow?.adjacent_counties) ? firstRow.adjacent_counties : []
        } as ComprehensiveMarketData;

        console.log('Final processed market data:', {
          hasData: !!marketData,
          topFirmsCount: marketData.top_firms?.length,
          adjacentCountiesCount: marketData.adjacent_counties?.length,
          keyMetrics: {
            population: marketData.total_population,
            income: marketData.median_household_income,
            employedPopulation: marketData.employed_population
          }
        });

        return marketData;
      } catch (error) {
        console.error('Error in market data query:', error);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        toast.error('Failed to fetch market data');
        throw error;
      }
    },
    enabled: !!stateFips && !!county,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });

  console.log('useMarketReportData hook returning:', {
    hasMarketData: !!marketData,
    isLoading,
    stateFipsAvailable: !!stateFips
  });

  return { marketData, isLoading };
};