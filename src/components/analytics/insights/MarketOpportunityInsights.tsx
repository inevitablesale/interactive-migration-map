import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Users, Building2 } from "lucide-react";

export function MarketOpportunityInsights() {
  const { data: marketData } = useQuery({
    queryKey: ['marketOpportunities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_market_opportunities');
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Market Opportunity Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <div className="text-sm font-medium text-white">Top Growth Markets</div>
          </div>
          <div className="space-y-2">
            {marketData?.slice(0, 3).map((market, index) => (
              <div key={index} className="text-sm text-white/60">
                {market.countyname}: {Math.round(market.migration_score)}% growth
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <div className="text-sm font-medium text-white">Market Saturation</div>
          </div>
          <div className="space-y-2">
            {marketData?.slice(0, 3).map((market, index) => (
              <div key={index} className="text-sm text-white/60">
                {market.countyname}: {Math.round(market.business_density_score)}% density
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-purple-400" />
            <div className="text-sm font-medium text-white">Service Coverage</div>
          </div>
          <div className="space-y-2">
            {marketData?.slice(0, 3).map((market, index) => (
              <div key={index} className="text-sm text-white/60">
                {market.countyname}: {Math.round(market.service_coverage_score)}% coverage
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}