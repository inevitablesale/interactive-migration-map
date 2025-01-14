import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Building2, TrendingUp, Users } from "lucide-react";

export function MarketEntryAnalysis() {
  const { data: marketEntryData } = useQuery({
    queryKey: ['marketEntryAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_market_entry_analysis');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {marketEntryData?.slice(0, 3).map((state, index) => (
          <Card key={state.statefp} className="p-4 bg-black/40 backdrop-blur-md border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">State {state.statefp}</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white/60">Firm Density</span>
                </div>
                <span className="text-white font-medium">
                  {state.firm_density.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white/60">Growth Rate</span>
                </div>
                <span className="text-white font-medium">
                  {state.avg_growth_rate.toFixed(1)}%
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}