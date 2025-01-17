import { ChartBar, Users, TrendingUp, Lock, Beaker } from "lucide-react";
import { KeyInsightsPanel } from "@/components/analytics/KeyInsightsPanel";
import { AIDealSourcer } from "@/components/analytics/AIDealSourcer";
import { ComparisonTool } from "@/components/ComparisonTool";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { BuyerProfileForm } from "@/components/analytics/BuyerProfileForm";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleTestMatchDeals = async () => {
    // Sample buyer profile data
    const testData = {
      buyerProfile: {
        id: 'test-123',
        preferences: {
          buyerType: 'individual',
          timeline: 'short-term',
          dealPreferences: ['cash', 'seller_financing'],
          preferredState: 'California',
          remotePreference: 'hybrid',
          marketType: 'major_metro',
          practiceSize: 'growing',
          services: ['tax', 'accounting', 'advisory'],
          additionalDetails: 'Looking for established practice with strong client base'
        }
      },
      firms: [] // The function will fetch matching firms
    };

    try {
      console.log('Testing match-deals with data:', testData);
      
      const { data, error } = await supabase.functions.invoke('match-deals', {
        body: testData
      });

      if (error) throw error;

      console.log('Match-deals response:', data);
      
      toast({
        title: "Test Completed",
        description: "Check the console for match-deals results",
      });
    } catch (error) {
      console.error('Test error:', error);
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Failed to test match-deals",
        variant: "destructive",
      });
    }
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
            Real-Time Market Intelligence That Evolves With Every New Firm
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Our AI continuously analyzes new accounting firms and market data, delivering fresh insights and opportunities as they emerge
          </p>
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
          <div className="mt-8">
            <Button 
              onClick={handleTestMatchDeals}
              variant="outline" 
              className="bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/50 text-purple-200"
            >
              <Beaker className="w-4 h-4 mr-2" />
              Test Match-Deals Function
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        <div className="grid grid-cols-1 gap-6">
          <KeyInsightsPanel />
          <div className="relative">
            <AIDealSourcer />
            <Lock className="absolute top-6 right-6 h-4 w-4 text-yellow-400" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-lg border border-white/10 shadow-xl">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              Accounting Firm Market Analyst
              <Lock className="h-4 w-4 text-yellow-400" />
            </h2>
            <ComparisonTool embedded={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
