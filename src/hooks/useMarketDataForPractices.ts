import { useQueries } from "@tanstack/react-query";
import { useMarketReportData } from "./useMarketReportData";

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
          
          const marketReport = await useMarketReportData(county, state);
          const countyData = marketReport.data?.countyData;
          
          // Calculate average salary from county data if available
          const avgSalaryPerEmployee = countyData?.payann && countyData?.emp 
            ? (countyData.payann * 1000) / countyData.emp 
            : 86259; // Fallback to national average
            
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