import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { MarketGrowthMetric } from "./types";
import { useNavigate } from "react-router-dom";

export function GrowthInsights() {
  const navigate = useNavigate();

  const { data: marketGrowthMetrics = [] } = useQuery({
    queryKey: ['marketGrowthMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_market_growth_metrics');
      if (error) throw error;
      return data;
    },
  });

  const handleNavigateToMarket = (county: string, state: string) => {
    navigate(`/market-report/${state}/${county}`);
  };

  const detailsContent = marketGrowthMetrics?.slice(0, 5).map((region, index) => (
    <div 
      key={index} 
      className="p-4 bg-black/40 rounded-lg cursor-pointer hover:bg-black/60 transition-colors"
      onClick={() => handleNavigateToMarket(region.county_name, region.state)}
    >
      <h3 className="text-lg font-semibold text-white">{region.county_name}, {region.state}</h3>
      <p className="text-sm text-gray-300">Growth Rate: {region.growth_rate_percentage.toFixed(1)}%</p>
      <p className="text-sm text-gray-300">Total Moves: {region.total_moves.toLocaleString()}</p>
      <div className="flex justify-between items-center mt-2">
        {region.state_rank && (
          <div className="text-right">
            <p className="text-gray-500 text-xs mb-0.5">State Rank:</p>
            <p className="text-2xl text-white/90 font-medium">{region.state_rank.toLocaleString()}</p>
          </div>
        )}
        {region.national_rank && (
          <div className="text-right">
            <p className="text-gray-500 text-xs mb-0.5">National Rank:</p>
            <p className="text-2xl text-blue-400/90 font-medium">{region.national_rank.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  ));

  return (
    <MetricCard
      title="Market Growth Leaders"
      value={marketGrowthMetrics?.[0] 
        ? `${marketGrowthMetrics[0].county_name}, ${marketGrowthMetrics[0].state}`
        : "Loading..."}
      icon={TrendingUp}
      insight={
        marketGrowthMetrics?.[0] 
          ? `${marketGrowthMetrics[0].growth_rate_percentage.toFixed(1)}% growth rate, ${(marketGrowthMetrics[0].total_moves || 0).toLocaleString()} total moves`
          : "Analyzing regional data"
      }
      detailsContent={detailsContent}
    />
  );
}