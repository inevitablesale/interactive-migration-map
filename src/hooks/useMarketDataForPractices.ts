import { useQueries } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Practice {
  id: string;
  region: string;
  COUNTYFP?: number;  
  STATEFP?: number;   
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

          // Cast numbers to strings for the query and pad COUNTYFP with leading zeros
          const statefp = practice.STATEFP.toString().padStart(2, '0');
          const countyfp = practice.COUNTYFP.toString().padStart(3, '0');
          
          console.log('Querying county_rankings with:', {
            STATEFP: statefp,
            COUNTYFP: countyfp,
            COUNTYNAME: practice.COUNTYNAME,
            originalSTATEFP: practice.STATEFP,
            originalCOUNTYFP: practice.COUNTYFP
          });

          const { data: countyData, error: countyError } = await supabase
            .from('county_rankings')
            .select('total_payroll, total_employees')
            .eq('STATEFP', statefp)
            .eq('COUNTYFP', countyfp)
            .eq('COUNTYNAME', practice.COUNTYNAME)
            .maybeSingle();

          if (countyError) {
            console.error('Error fetching county data:', countyError);
            throw countyError;
          }
          
          // Calculate average salary from county data if available
          const avgSalaryPerEmployee = countyData?.total_payroll && countyData?.total_employees 
            ? (countyData.total_payroll) / countyData.total_employees 
            : 86259; // Fallback to national average
            
          console.log('Market data query result:', {
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