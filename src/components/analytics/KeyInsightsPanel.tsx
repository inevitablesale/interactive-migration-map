import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TopGrowthRegion {
  county_name: string;
  state_name: string;
  growth_rate: number;
  firm_density: number;
  total_firms: number;
  total_population: number;
}

async function fetchTopGrowthRegions() {
  const { data, error } = await supabase.rpc('get_top_growth_regions');
  if (error) throw error;
  return data as TopGrowthRegion[];
}

export function KeyInsightsPanel() {
  const { data: topRegions, isLoading } = useQuery({
    queryKey: ['topGrowthRegions'],
    queryFn: fetchTopGrowthRegions,
  });

  const topRegion = topRegions?.[0];

  const insights = [
    {
      title: "Top Growth Region",
      value: topRegion 
        ? `${topRegion.county_name}, ${topRegion.growth_rate}%`
        : "Loading...",
      insight: topRegion
        ? `${topRegion.total_firms} firms, ${(topRegion.firm_density).toFixed(1)} per 10k residents`
        : "Analyzing regional data",
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
            <p className="text-sm text-gray-400">{insight.insight}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}