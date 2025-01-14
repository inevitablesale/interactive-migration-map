import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Building2 } from "lucide-react";

export function GrowthStrategyAnalysis() {
  const { data: growthData } = useQuery({
    queryKey: ['growthStrategyAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_growth_strategy_analysis');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {growthData?.slice(0, 5).map((msa) => (
          <Card key={msa.msa} className="p-4 bg-black/40 backdrop-blur-md border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{msa.msa_name}</h3>
                <p className="text-sm text-white/60">{msa.total_firms.toLocaleString()} firms</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-white font-medium">{msa.avg_growth_rate.toFixed(1)}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-sm text-white/60">Migration</div>
                  <div className="text-white font-medium">
                    {msa.recent_migration.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-yellow-400" />
                <div>
                  <div className="text-sm text-white/60">Market Saturation</div>
                  <div className="text-white font-medium">
                    {msa.market_saturation.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}