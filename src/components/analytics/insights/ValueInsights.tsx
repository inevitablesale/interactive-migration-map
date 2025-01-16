import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { ValueMetric } from "./types";
import { useNavigate } from "react-router-dom";

export function ValueInsights() {
  const navigate = useNavigate();
  
  const { data: valueMetrics = [] } = useQuery({
    queryKey: ['valueMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_value_metrics');
      if (error) throw error;
      return data;
    },
  });

  const handleNavigateToMarket = (county: string, state: string) => {
    navigate(`/market-report/${state}/${county}`);
  };

  const transformedValueMetrics = valueMetrics?.map(metric => ({
    ...metric,
    state_rank: metric.state_rank || undefined,
    national_rank: metric.national_rank || undefined
  }));

  const detailsContent = transformedValueMetrics?.slice(0, 5).map((market, index) => (
    <div 
      key={index} 
      className="p-4 bg-black/40 rounded-lg cursor-pointer hover:bg-black/60 transition-colors"
      onClick={() => handleNavigateToMarket(market.county_name, market.state_name)}
    >
      <h3 className="text-lg font-semibold text-white">{market.county_name}, {market.state_name}</h3>
      <p className="text-sm text-gray-300">Median Income: ${market.median_income.toLocaleString()}</p>
      <p className="text-sm text-gray-300">Average Revenue: ${(market.avg_revenue / 1000).toFixed(1)}K</p>
      <p className="text-sm text-gray-300">Growth Potential: {market.growth_potential.toFixed(1)}%</p>
      <div className="flex justify-between items-center mt-2">
        {market.state_rank && (
          <div className="text-right">
            <p className="text-gray-500 text-xs mb-0.5">State Rank:</p>
            <p className="text-2xl text-white/90 font-medium">{market.state_rank.toLocaleString()}</p>
          </div>
        )}
        {market.national_rank && (
          <div className="text-right">
            <p className="text-gray-500 text-xs mb-0.5">National Rank:</p>
            <p className="text-2xl text-blue-400/90 font-medium">{market.national_rank.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  ));

  return (
    <MetricCard
      title="High-Value Markets"
      value={transformedValueMetrics?.[0] 
        ? `${transformedValueMetrics[0].county_name}, ${transformedValueMetrics[0].state_name}`
        : "Loading..."}
      icon={DollarSign}
      insight={
        transformedValueMetrics?.[0] 
          ? `$${(transformedValueMetrics[0].avg_revenue / 1000).toFixed(1)}K avg revenue, ${transformedValueMetrics[0].growth_potential.toFixed(1)}% growth potential`
          : "Analyzing market data"
      }
      detailsContent={detailsContent}
    />
  );
}