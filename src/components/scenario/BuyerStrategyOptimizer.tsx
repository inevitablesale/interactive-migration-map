import React from 'react';
import { Card } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, TrendingUp, Users } from 'lucide-react';

export function BuyerStrategyOptimizer() {
  const { data: marketAnalysis } = useQuery({
    queryKey: ['marketAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_market_entry_analysis');
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Strategy Optimization</h3>
      
      <div className="space-y-6">
        {marketAnalysis?.slice(0, 5).map((market, index) => (
          <div key={index} className="bg-white/5 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">State {market.statefp}</h4>
              <div className="flex items-center gap-2">
                {market.market_saturation > 0.7 ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                ) : market.avg_growth_rate > 5 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <Users className="w-4 h-4 text-blue-400" />
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-sm text-white/60">Market Saturation</p>
                <p className="text-white font-medium">{(market.market_saturation * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Growth Rate</p>
                <p className="text-white font-medium">{market.avg_growth_rate.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Firm Density</p>
                <p className="text-white font-medium">{market.firm_density.toFixed(1)}</p>
              </div>
            </div>

            <div className="mt-4 text-sm">
              <p className="text-white/60">
                {market.market_saturation > 0.7 
                  ? "High saturation market - consider differentiation strategy"
                  : market.avg_growth_rate > 5
                  ? "High growth market - consider aggressive expansion"
                  : "Balanced market - maintain steady growth"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}