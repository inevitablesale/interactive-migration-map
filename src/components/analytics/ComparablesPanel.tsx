import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Users, Building2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function ComparablesPanel() {
  const { data: rankings } = useQuery({
    queryKey: ['stateRankings'],
    queryFn: async () => {
      const { data: stateData, error: stateError } = await supabase
        .from('state_data')
        .select('*')
        .order('ESTAB', { ascending: false });

      if (stateError) throw stateError;

      const { data: nationalData, error: nationalError } = await supabase
        .from('national_data')
        .select('*')
        .single();

      if (nationalError) throw nationalError;

      return stateData.map(state => {
        const firmDensity = state.ESTAB && state.B01001_001E ? 
          (state.ESTAB / state.B01001_001E) * 10000 : 0;
        const nationalDensity = nationalData.ESTAB && nationalData.B01001_001E ? 
          (nationalData.ESTAB / nationalData.B01001_001E) * 10000 : 0;
        
        const growthRate = state.MOVEDIN2022 && state.MOVEDIN2021 ?
          ((state.MOVEDIN2022 - state.MOVEDIN2021) / state.MOVEDIN2021) * 100 : 0;
        const nationalGrowthRate = nationalData.MOVEDIN2022 && nationalData.MOVEDIN2021 ?
          ((nationalData.MOVEDIN2022 - nationalData.MOVEDIN2021) / nationalData.MOVEDIN2021) * 100 : 0;

        return {
          statefp: state.STATEFP,
          firmDensity,
          growthRate,
          comparedToNational: {
            density: firmDensity / nationalDensity,
            growth: growthRate / nationalGrowthRate
          }
        };
      });
    }
  });

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">State Rankings vs National Average</h3>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-4">
          {rankings?.map((state) => (
            <div
              key={state.statefp}
              className="bg-white/5 rounded-lg p-4 space-y-3 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-white">State {state.statefp}</h4>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-white/60">Firm Density</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">
                      {state.firmDensity.toFixed(2)}
                    </span>
                    <div className={cn(
                      "flex items-center gap-1 text-sm",
                      state.comparedToNational.density > 1 ? "text-green-400" : "text-red-400"
                    )}>
                      {state.comparedToNational.density > 1 ? 
                        <ArrowUpRight className="w-4 h-4" /> : 
                        <ArrowDownRight className="w-4 h-4" />
                      }
                      {Math.abs((state.comparedToNational.density - 1) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white/60">Growth Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">
                      {state.growthRate.toFixed(1)}%
                    </span>
                    <div className={cn(
                      "flex items-center gap-1 text-sm",
                      state.comparedToNational.growth > 1 ? "text-green-400" : "text-red-400"
                    )}>
                      {state.comparedToNational.growth > 1 ? 
                        <ArrowUpRight className="w-4 h-4" /> : 
                        <ArrowDownRight className="w-4 h-4" />
                      }
                      {Math.abs((state.comparedToNational.growth - 1) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}