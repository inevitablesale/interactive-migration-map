import { ChartBar, Users, TrendingUp } from "lucide-react";
import { KeyInsightsPanel } from "@/components/analytics/KeyInsightsPanel";
import { MarketHighlights } from "@/components/analytics/MarketHighlights";
import { AlertsPanel } from "@/components/analytics/AlertsPanel";
import { ComparisonTool } from "@/components/ComparisonTool";
import { EnhancedAnalytics } from "@/components/analytics/EnhancedAnalytics";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CountyRanking } from "@/types/analytics";

const fetchCountyRankings = async () => {
  const { data, error } = await supabase.rpc('get_county_rankings');
  if (error) throw error;
  return data;
};

export default function Analysis() {
  const { data: rankingsData } = useQuery({
    queryKey: ['countyRankings'],
    queryFn: fetchCountyRankings,
  });

  // Calculate summary stats from rankings data
  const stats = [
    {
      label: "Regions Analyzed",
      value: rankingsData ? rankingsData.length.toString() : "Loading...",
      icon: ChartBar,
    },
    {
      label: "Firms Monitored",
      value: rankingsData 
        ? `${(rankingsData.reduce((sum, r) => sum + Number(r.total_firms), 0)).toLocaleString()}+`
        : "Loading...",
      icon: Users,
    },
    {
      label: "Avg Growth Rate (YoY)",
      value: rankingsData 
        ? `${(rankingsData.reduce((sum, r) => sum + (r.growth_rate || 0), 0) / rankingsData.length).toFixed(1)}%`
        : "Loading...",
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
            {stats.map((stat) => (
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
        <KeyInsightsPanel rankingsData={rankingsData} />
        <EnhancedAnalytics />
        <MarketHighlights rankingsData={rankingsData} />
        <AlertsPanel />
        <ComparisonTool />
      </div>
    </div>
  );
}