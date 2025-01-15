import { ChartBar, Users, TrendingUp } from "lucide-react";
import { KeyInsightsPanel } from "@/components/analytics/KeyInsightsPanel";
import { MarketHighlights } from "@/components/analytics/MarketHighlights";
import { AlertsPanel } from "@/components/analytics/AlertsPanel";
import { ComparisonTool } from "@/components/ComparisonTool";
import { MarketSimilarityAnalysis } from "@/components/analytics/MarketSimilarityAnalysis";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { BuyerProfileForm } from "@/components/analytics/BuyerProfileForm";
import { ScenarioModeling } from "@/components/scenario/ScenarioModeling";

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
  const [scenarioData, setScenarioData] = useState<any[]>([]);
  
  const { data: stats } = useQuery({
    queryKey: ['analysisStats'],
    queryFn: fetchStats
  });

  const { data: stateData } = useQuery({
    queryKey: ['stateData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_data')
        .select('*');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: statesList } = useQuery({
    queryKey: ['statesList'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_fips_codes')
        .select('*');
      if (error) throw error;
      return data || [];
    }
  });

  const handleUpdateScenario = (updatedData: any[]) => {
    setScenarioData(updatedData);
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AlertsPanel />
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <Dialog open={showProfileForm} onOpenChange={setShowProfileForm}>
              <Button 
                onClick={() => setShowProfileForm(true)}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Create Buyer Profile
              </Button>
              <DialogContent className="bg-gray-900 border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-white text-xl">Create Buyer Profile</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Set up your buyer profile to receive personalized market insights and opportunities that match your investment criteria.
                  </DialogDescription>
                </DialogHeader>
                <BuyerProfileForm onSuccess={() => setShowProfileForm(false)} />
              </DialogContent>
            </Dialog>
            <p className="text-sm text-gray-300">
              Create a buyer profile to get personalized recommendations, market insights, and notifications about opportunities that match your criteria.
            </p>
          </div>
        </div>
        <KeyInsightsPanel />
        <MarketSimilarityAnalysis />
        {stateData && statesList && (
          <ScenarioModeling 
            stateData={stateData}
            statesList={statesList}
            onUpdateScenario={handleUpdateScenario}
          />
        )}
        <div className="bg-[#111111] backdrop-blur-md rounded-lg border border-white/10 shadow-xl">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Compare States</h2>
            <ComparisonTool embedded={true} />
          </div>
        </div>
        <MarketHighlights />
      </div>
    </div>
  );
}