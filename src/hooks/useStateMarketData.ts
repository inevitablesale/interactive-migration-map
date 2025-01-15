import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStateMarketData = (stateFips: string) => {
  return useQuery({
    queryKey: ['stateMarketReport', stateFips],
    queryFn: async () => {
      // Get state data
      const { data: stateData, error: stateError } = await supabase
        .from('state_data')
        .select('*')
        .eq('STATEFP', stateFips)
        .single();

      if (stateError) throw stateError;
      if (!stateData) throw new Error('State data not found');

      console.log('State Data:', stateData);

      // Get all counties for the state, sorted by population
      const { data: countyData, error: countyError } = await supabase
        .from('county_data')
        .select('*')
        .eq('STATEFP', stateFips)
        .order('B01001_001E', { ascending: false });

      if (countyError) throw countyError;

      // Create a Map to keep track of unique counties while preserving the sort order
      const uniqueCounties = new Map();
      
      countyData?.forEach(county => {
        if (!uniqueCounties.has(county.COUNTYNAME)) {
          uniqueCounties.set(county.COUNTYNAME, county);
        }
      });

      // Get market opportunities
      const { data: marketOpportunities } = await supabase
        .rpc('get_market_opportunities');

      const opportunities = marketOpportunities?.filter(opp => opp.statefp === stateFips);

      // Get competitive analysis
      const { data: competitiveAnalysis } = await supabase
        .rpc('get_competitive_analysis');

      const analysis = competitiveAnalysis?.find(a => a.statefp === stateFips);

      // Convert Map values back to array and take top 6
      const topCounties = Array.from(uniqueCounties.values()).slice(0, 6);

      return {
        stateData,
        topCounties,
        marketOpportunities: opportunities || [],
        competitiveAnalysis: analysis
      };
    },
    enabled: !!stateFips
  });
};
