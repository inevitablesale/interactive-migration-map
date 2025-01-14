import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Target, PieChart, TrendingUp } from "lucide-react";

export function CompetitiveIntelligence() {
  const { data: competitiveData } = useQuery({
    queryKey: ['competitiveAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_competitive_analysis');
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Competitive Intelligence</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-red-400" />
            <div className="text-sm font-medium text-white">Competition Level</div>
          </div>
          <div className="space-y-2">
            {competitiveData?.slice(0, 3).map((market, index) => (
              <div key={index} className="text-sm text-white/60">
                State {market.statefp}: {market.competition_level}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-yellow-400" />
            <div className="text-sm font-medium text-white">Market Share</div>
          </div>
          <div className="space-y-2">
            {competitiveData?.slice(0, 3).map((market, index) => (
              <div key={index} className="text-sm text-white/60">
                State {market.statefp}: {Math.round(market.market_concentration)}%
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <div className="text-sm font-medium text-white">Growth Potential</div>
          </div>
          <div className="space-y-2">
            {competitiveData?.slice(0, 3).map((market, index) => (
              <div key={index} className="text-sm text-white/60">
                State {market.statefp}: {Math.round(market.avg_employee_count)} avg employees
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}