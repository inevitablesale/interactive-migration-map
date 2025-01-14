import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Target, InfoIcon, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface MarketGrowthMetric {
  county_name: string;
  state_name: string;
  growth_rate: number;
  firm_density: number;
  total_firms: number;
  total_population: number;
}

interface TopGrowthRegion {
  county_name: string;
  state_name: string;
  growth_rate: number;
  firm_density: number;
  total_firms: number;
  total_population: number;
}

async function fetchMarketGrowthMetrics() {
  const { data, error } = await supabase.rpc('get_market_growth_metrics');
  if (error) throw error;
  return data as MarketGrowthMetric[];
}

async function fetchTopGrowthRegions() {
  const { data, error } = await supabase.rpc('get_top_growth_regions');
  if (error) throw error;
  return data as TopGrowthRegion[];
}

export function KeyInsightsPanel() {
  const { data: growthMetrics, isLoading } = useQuery({
    queryKey: ['marketGrowthMetrics'],
    queryFn: fetchMarketGrowthMetrics,
  });

  const { data: topRegions } = useQuery({
    queryKey: ['topGrowthRegions'],
    queryFn: fetchTopGrowthRegions,
  });

  console.log('Top regions:', topRegions); // Debug log

  const topGrowthRegion = growthMetrics?.[0];

  const insights = [
    {
      title: "Top Growth Region",
      value: topGrowthRegion 
        ? `${topGrowthRegion.county_name}, ${topGrowthRegion.state}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topGrowthRegion ? (
            <>
              {`${topGrowthRegion.growth_rate_percentage}% of national moves, ${topGrowthRegion.total_moves.toLocaleString()} total moves`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Move-in Distribution:</p>
                      <div className="text-sm text-gray-300">
                        <p>2022: {topGrowthRegion.total_movedin_2022.toLocaleString()}</p>
                        <p>2021: {topGrowthRegion.total_movedin_2021.toLocaleString()}</p>
                        <p>2020: {topGrowthRegion.total_movedin_2020.toLocaleString()}</p>
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <p>Total Moves: {topGrowthRegion.total_moves.toLocaleString()}</p>
                          <p className="mt-1">
                            Represents {topGrowthRegion.growth_rate_percentage}% of all national moves
                          </p>
                        </div>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View Top 10</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold mb-4">Top 10 Growth Regions</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      {topRegions?.map((region, index) => (
                        <div 
                          key={`${region.county_name}-${region.state_name}-${index}`}
                          className="grid grid-cols-6 gap-4 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-accent">#{index + 1}</span>
                          </div>
                          <div className="col-span-2">
                            <p className="font-medium">{region.county_name}</p>
                            <p className="text-sm text-white/60">{region.state_name}</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-green-400">+{region.growth_rate.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center">
                            {region.firm_density.toFixed(1)}
                          </div>
                          <div className="flex items-center">
                            {region.total_population.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
              <h3 className="font-semibold text-lg text-white">{insight.title}</h3>
            </div>
            <p className="text-2xl font-bold text-white mb-2">{insight.value}</p>
            <div className="text-sm text-white/80">{insight.insight}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}