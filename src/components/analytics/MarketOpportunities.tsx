import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Building2 } from "lucide-react";
import { MarketOpportunityScore } from "@/types/supabase";

export function MarketOpportunities() {
  const { data: opportunities } = useQuery<MarketOpportunityScore[]>({
    queryKey: ['marketOpportunities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_market_opportunities')
        .order('migration_score', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-2">Top Market Opportunities</h3>
        <p className="text-sm text-white/60 mb-4">
          Markets with high growth potential based on migration, business density, and service coverage
        </p>
        
        <div className="grid gap-4">
          {opportunities?.map((market, index) => (
            <Card key={index} className="bg-black/40 border-white/10">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-medium">{market.COUNTYNAME}</h4>
                    <p className="text-sm text-white/60">Opportunity Score: {Math.round((market.migration_score + market.business_density_score + market.service_coverage_score) / 3)}</p>
                  </div>
                  <Button className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                    Explore
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <div className="text-sm">
                      <div className="text-white/60">Migration</div>
                      <div className="text-white font-medium">{Math.round(market.migration_score)}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-yellow-400" />
                    <div className="text-sm">
                      <div className="text-white/60">Density</div>
                      <div className="text-white font-medium">{Math.round(market.business_density_score)}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <div className="text-sm">
                      <div className="text-white/60">Coverage</div>
                      <div className="text-white font-medium">{Math.round(market.service_coverage_score)}%</div>
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