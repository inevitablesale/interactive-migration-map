import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Users, Building2, Map } from "lucide-react";

export const MarketMetrics = () => {
  const { data: metrics } = useQuery({
    queryKey: ['marketMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_enhanced_market_scores')
        .limit(1);
      
      if (error) throw error;
      return data;
    }
  });

  const topMetric = metrics?.[0];

  return (
    <Card className="bg-black/40 backdrop-blur-sm border-white/10 p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-semibold text-white">Market Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-white/60">Total Regions</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {topMetric ? '50' : '-'}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white/60">Avg Growth Rate</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {topMetric ? `${(topMetric.market_potential_score || 0).toFixed(1)}%` : '-'}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-white/60">Market Saturation</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {topMetric ? `${(topMetric.business_density_score || 0).toFixed(1)}%` : '-'}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-white/60">Employment Score</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {topMetric ? `${(topMetric.employment_score || 0).toFixed(1)}%` : '-'}
          </p>
        </div>
      </div>
    </Card>
  );
};