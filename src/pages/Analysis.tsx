import { ChartBar, Users, TrendingUp } from "lucide-react";
import { KeyInsightsPanel } from "@/components/analytics/KeyInsightsPanel";
import { MarketHighlights } from "@/components/analytics/MarketHighlights";
import { AlertsPanel } from "@/components/analytics/AlertsPanel";
import { ComparisonTool } from "@/components/ComparisonTool";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

async function fetchStats() {
  // Get total regions analyzed from county_rankings view
  const { count: regionsCount } = await supabase
    .from('county_rankings')
    .select('*', { count: 'exact', head: true });

  // Get total firms monitored
  const { count: firmsCount } = await supabase
    .from('canary_firms_data')
    .select('*', { count: 'exact', head: true });

  // Calculate average growth rate
  const { data: growthData } = await supabase
    .from('county_data')
    .select('MOVEDIN2022, MOVEDIN2021, MOVEDIN2020')
    .not('MOVEDIN2022', 'is', null)
    .not('MOVEDIN2021', 'is', null)
    .not('MOVEDIN2020', 'is', null);

  let avgGrowthRate = 0;
  if (growthData && growthData.length > 0) {
    const growthRates = growthData.map(county => {
      const total = county.MOVEDIN2022 + county.MOVEDIN2021 + county.MOVEDIN2020;
      const yearlyGrowth = ((county.MOVEDIN2022 - county.MOVEDIN2020) / county.MOVEDIN2020) * 100;
      return yearlyGrowth;
    });
    
    avgGrowthRate = growthRates.reduce((acc, rate) => acc + rate, 0) / growthRates.length;
  }

  return {
    regionsCount: regionsCount || 0,
    firmsCount: firmsCount || 0,
    avgGrowthRate: avgGrowthRate || 0
  };
}

export default function Analysis() {
  const { data: stats } = useQuery({
    queryKey: ['analysisStats'],
    queryFn: fetchStats
  });

  const statsData = [
    {
      label: "Regions Analyzed",
      value: stats ? stats.regionsCount.toLocaleString() : "Loading...",
      icon: ChartBar,
    },
    {
      label: "Firms Monitored",
      value: stats ? `${stats.firmsCount.toLocaleString()}+` : "Loading...",
      icon: Users,
    },
    {
      label: "Avg Growth Rate (YoY)",
      value: stats ? `${stats.avgGrowthRate.toFixed(1)}%` : "Loading...",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-[#222222]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-black/40">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Transform Market Data into Clear, Actionable Insights
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {statsData.map((stat) => (
              <div
                key={stat.label}
                className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 animate-fade-in hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <stat.icon className="w-5 h-5 text-blue-400" />
                  <span className="text-2xl font-bold text-white">
                    {stat.value}
                  </span>
                </div>
                <p className="text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        <KeyInsightsPanel />
        <MarketHighlights />
        <AlertsPanel />
        <ComparisonTool />
      </div>
    </div>
  );
}