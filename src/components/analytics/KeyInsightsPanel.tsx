import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Target, InfoIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MarketGrowthMetric {
  county_name: string;
  state: string;
  growth_rate_percentage: number;
  population_growth: number;
  total_movedin_2022: number;
  total_movedin_2021: number;
  total_movedin_2020: number;
}

async function fetchMarketGrowthMetrics() {
  const { data, error } = await supabase.rpc('get_market_growth_metrics');
  if (error) throw error;
  return data as MarketGrowthMetric[];
}

export function KeyInsightsPanel() {
  const { data: growthMetrics, isLoading } = useQuery({
    queryKey: ['marketGrowthMetrics'],
    queryFn: fetchMarketGrowthMetrics,
  });

  const topGrowthRegion = growthMetrics?.[0];

  const insights = [
    {
      title: "Top Growth Region",
      value: topGrowthRegion 
        ? `${topGrowthRegion.county_name}, ${topGrowthRegion.state}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          {topGrowthRegion ? (
            <>
              {`${topGrowthRegion.growth_rate_percentage}% growth, ${topGrowthRegion.population_growth.toLocaleString()} new residents`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-600 hover:text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Growth Rate Calculation:</p>
                      <div className="text-sm">
                        <p>2022 Moves: {topGrowthRegion.total_movedin_2022.toLocaleString()}</p>
                        <p>2020 Moves: {topGrowthRegion.total_movedin_2020.toLocaleString()}</p>
                        <div className="mt-2 pt-2 border-t">
                          <p>Formula: ((2022 - 2020) / 2020) × 100</p>
                          <p className="mt-1">
                            = (({topGrowthRegion.total_movedin_2022.toLocaleString()} - {topGrowthRegion.total_movedin_2020.toLocaleString()}) / {topGrowthRegion.total_movedin_2020.toLocaleString()}) × 100
                          </p>
                          <p className="mt-1">= {topGrowthRegion.growth_rate_percentage}%</p>
                        </div>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            "Analyzing regional data"
          )}
        </div>
      ),
      icon: TrendingUp,
    },
    {
      title: "Competitive Market",
      value: "Florida, 6.5% density",
      insight: "Strong payroll growth",
      icon: Users,
    },
    {
      title: "Underserved Region",
      value: "Montana, 1.2 firms/10k",
      insight: "Low saturation, high opportunity",
      icon: Target,
    },
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold">Market Insights at a Glance</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {insights.map((insight) => (
          <Card
            key={insight.title}
            className="p-6 bg-black/40 backdrop-blur-md border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <insight.icon className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-lg">{insight.title}</h3>
            </div>
            <p className="text-2xl font-bold mb-2">{insight.value}</p>
            <div className="text-sm text-gray-700">{insight.insight}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}