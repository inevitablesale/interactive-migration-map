import { useQuery } from "@tanstack/react-query";

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

      console.log('[Step 1] Inputs validated. Proceeding...');
      return {}; // Placeholder for the next steps
    },
    enabled: !!stateName && !!county, // Only enable the query if inputs are valid
  });

  // Log query completion status
  console.log('[Step 1] Query complete:', { 
    hasData: !!marketData, 
    isLoading, 
    hasError: !!error,
  });

  return { marketData, isLoading, error };
};
