import { useQueries } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Practice {
  id: string;
  region: string;
  COUNTYFP?: number;  // Changed from string to number
  STATEFP?: number;   // Changed from string to number
  COUNTYNAME?: string;
}

export const useMarketDataForPractices = (practices: Practice[] | undefined) => {
  const marketQueries = useQueries({
    queries: (practices || []).map(practice => {
      return {
        queryKey: ['marketReport', practice.COUNTYFP, practice.STATEFP, practice.id],
        queryFn: async () => {
          if (!practice.COUNTYFP || !practice.STATEFP || !practice.COUNTYNAME) {
            console.log('Missing FIPS codes or county name:', { practice });
            return { avgSalaryPerEmployee: 86259 }; // Fallback value
          }

          // Get the county data using FIPS codes
          const { data: countyData, error: countyError } = await supabase
            .from('county_data')
            .select('PAYANN, EMP')
            .eq('STATEFP', practice.STATEFP.toString())  // Convert to string for query
            .eq('COUNTYFP', practice.COUNTYFP.toString()) // Convert to string for query
            .eq('COUNTYNAME', practice.COUNTYNAME)
            .maybeSingle();

          if (countyError) throw countyError;
          
          // Calculate average salary from county data if available
          const avgSalaryPerEmployee = countyData?.PAYANN && countyData?.EMP 
            ? (countyData.PAYANN * 1000) / countyData.EMP 
            : 86259; // Fallback to national average
            
          console.log('Market data query for:', {
            COUNTYFP: practice.COUNTYFP,
            STATEFP: practice.STATEFP,
            COUNTYNAME: practice.COUNTYNAME,
            countyData,
            avgSalaryPerEmployee
          });

          return { avgSalaryPerEmployee };
        },
        enabled: !!practice.region,
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
        cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
      };
    })
  });

  return marketQueries;
};