import { ChartBar, Users, TrendingUp, Bot, Sparkles } from "lucide-react";
import { KeyInsightsPanel } from "@/components/analytics/KeyInsightsPanel";
import { MarketHighlights } from "@/components/analytics/MarketHighlights";
import { ComparisonTool } from "@/components/ComparisonTool";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { BuyerProfileForm } from "@/components/analytics/BuyerProfileForm";
import { MarketInsightsPanel } from "@/components/analytics/insights/MarketInsightsPanel";

async function fetchStats() {
  // Get total regions analyzed from county_rankings view
  const { count: regionsCount } = await supabase
    .from('county_rankings')
    .select('*', { count: 'exact', head: true });

  // Get total firms monitored
  const { count: firmsCount } = await supabase
    .from('canary_firms_data')
    .select('*', { count: 'exact', head: true });

  // Get count of cities tracked
  const { count: citiesCount } = await supabase
    .from('region_data')
    .select('*', { count: 'exact', head: true });

  return {
    regionsCount: regionsCount || 0,
    firmsCount: firmsCount || 0,
    citiesCount: citiesCount || 0
  };
}

export default function Analysis() {
  const [showProfileForm, setShowProfileForm] = useState(false);
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
      label: "Cities Tracked",
      value: stats ? stats.citiesCount.toLocaleString() : "Loading...",
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
        <MarketInsightsPanel />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Bot className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">AI Deal Sourcer</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-medium text-white">Personalized Deal Matching</h3>
                </div>
                <p className="text-white/70 mb-6">
                  Our AI analyzes market data and your preferences to find the perfect opportunities. Set up your profile to get started.
                </p>
                <Dialog open={showProfileForm} onOpenChange={setShowProfileForm}>
                  <Button 
                    onClick={() => setShowProfileForm(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    Create AI-Powered Buyer Profile
                  </Button>
                  <DialogContent className="bg-gray-900 border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-white text-xl">Create Buyer Profile</DialogTitle>
                      <DialogDescription className="text-gray-300">
                        Set up your buyer profile to receive AI-powered market insights and opportunities that match your investment criteria.
                      </DialogDescription>
                    </DialogHeader>
                    <BuyerProfileForm onSuccess={() => setShowProfileForm(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <ChartBar className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Market Intelligence</h2>
            </div>
            <ComparisonTool embedded={true} />
          </div>
        </div>
        <KeyInsightsPanel />
        <MarketHighlights />
      </div>
    </div>
  );
}