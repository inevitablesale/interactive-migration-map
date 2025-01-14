import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WeightedMarketOpportunity } from "@/types/analytics";

export function MarketOpportunities() {
  const { data: opportunities } = useQuery<WeightedMarketOpportunity[]>({
    queryKey: ['weightedMarketOpportunities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_weighted_market_opportunities');
      
      if (error) throw error;

      return data.map(item => ({
        statefp: item.statefp,
        countyfp: item.countyfp,
        countyname: item.countyname,
        state_name: item.state_name,
        total_score: item.total_score,
        migration_score: item.migration_score,
        economic_score: item.economic_score,
        market_score: item.market_score,
        details: {
          median_income: Number(item.details.median_income),
          employment_rate: Number(item.details.employment_rate),
          housing_value: Number(item.details.housing_value),
          education_rate: Number(item.details.education_rate),
          professional_services_rate: Number(item.details.professional_services_rate),
          housing_occupancy: Number(item.details.housing_occupancy)
        }
      }));
    }
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-2">Top Growth Markets</h3>
        <p className="text-sm text-white/60 mb-4">
          Markets with highest potential based on migration, economic health, and market environment
        </p>
        
        <div className="grid gap-4">
          {opportunities?.map((market, index) => (
            <Card key={index} className="bg-black/40 border-white/10">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-medium">{market.countyname}</h4>
                    <p className="text-sm text-white/60">{market.state_name}</p>
                  </div>
                  <Button className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                    Explore
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <div className="text-sm text-left">
                            <div className="text-white/60">Migration</div>
                            <div className="text-white font-medium">{Math.round(market.migration_score)}%</div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Population movement and growth trends (30% weight)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-yellow-400" />
                          <div className="text-sm text-left">
                            <div className="text-white/60">Economic</div>
                            <div className="text-white font-medium">{Math.round(market.economic_score)}%</div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Economic health indicators (40% weight)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          <div className="text-sm text-left">
                            <div className="text-white/60">Market</div>
                            <div className="text-white font-medium">{Math.round(market.market_score)}%</div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Market environment factors (30% weight)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="text-sm">
                      <span className="text-white/60">Total Score: </span>
                      <span className="text-white font-medium">{Math.round(market.total_score)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}