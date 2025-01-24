import { useQueries } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Practice {
  id: string;
  region: string;
}

export const useMarketDataForPractices = (practices: Practice[] | undefined) => {
  // Parse location to get county and state
  const getLocationParts = (location: string) => {
    const parts = location.split(",").map(part => part.trim());
    let county = parts[0];
    let state = parts[1];

    // Add "County" suffix if not present and not empty
    if (county && !county.toLowerCase().includes("county")) {
      county = `${county} County`;
    }

    return { county, state };
  };

  const marketQueries = useQueries({
    queries: (practices || []).map(practice => {
      const { county, state } = getLocationParts(practice.region);
      
      return {
        queryKey: ['marketReport', county, state, practice.id],
        queryFn: async () => {
          if (!county || !state) {
            return { avgSalaryPerEmployee: 86259 }; // Fallback value
          }

          // First get the state FIPS code
          const { data: stateFips, error: stateFipsError } = await supabase
            .from('state_fips_codes')
            .select('STATEFP')
            .eq('state', state)
            .maybeSingle();

          if (stateFipsError) throw stateFipsError;
          if (!stateFips) return { avgSalaryPerEmployee: 86259 };

          // Then get the county data using the FIPS code
          const { data: countyData, error: countyError } = await supabase
            .from('county_data')
            .select('PAYANN, EMP')
            .eq('STATEFP', stateFips.STATEFP)
            .eq('COUNTYNAME', county)
            .maybeSingle();

          if (countyError) throw countyError;
          
          // Calculate average salary from county data if available
          const avgSalaryPerEmployee = countyData?.PAYANN && countyData?.EMP 
            ? (countyData.PAYANN * 1000) / countyData.EMP 
            : 86259; // Fallback to national average
            
          console.log('Market data query for:', {
            county,
            state,
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