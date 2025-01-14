import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { InteractiveToolsSection } from "@/components/InteractiveToolsSection";
import { WelcomeSection } from "@/components/analytics/WelcomeSection";
import { HeatmapSection } from "@/components/analytics/HeatmapSection";
import { MarketEntryAnalysis } from "@/components/analytics/market-entry/MarketEntryAnalysis";
import { GrowthStrategyAnalysis } from "@/components/analytics/growth/GrowthStrategyAnalysis";
import { OpportunityAnalysis } from "@/components/analytics/opportunities/OpportunityAnalysis";
import { BuyerProfileManager } from "@/components/analytics/BuyerProfileManager";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lock, ArrowRight, BarChart3, Map, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MarketMetrics } from "@/components/analytics/MarketMetrics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Analysis = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter') || 'market-entry';
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ['buyerProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('buyer_profiles')
        .select('subscription_tier')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const isFreeTier = !profile || profile.subscription_tier === 'free';

  const handleFilterChange = (filter: string) => {
    if (isFreeTier && (filter === 'growth-strategy' || filter === 'opportunities')) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to access advanced analytics and growth strategies.",
        variant: "default",
      });
      return;
    }
    setSearchParams({ filter });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section */}
      <div className="relative bg-black/40 backdrop-blur-md border-b border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Turn Market Insights into Your Competitive Advantage
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl">
            Discover actionable intelligence from 545 regions and 1.4M+ data points, tailored to your acquisition goals.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => handleFilterChange('market-entry')}
            >
              Analyze My Market
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/20 hover:bg-white/10"
              onClick={() => handleFilterChange('opportunities')}
            >
              Compare Opportunities
            </Button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-8 px-6">
            <button
              onClick={() => handleFilterChange('market-entry')}
              className={cn(
                "py-4 text-white/80 hover:text-white transition-colors relative flex items-center gap-2",
                activeFilter === 'market-entry' && "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
              )}
            >
              <Map className="w-4 h-4" />
              Market Entry
            </button>
            <button
              onClick={() => handleFilterChange('growth-strategy')}
              className={cn(
                "py-4 text-white/80 hover:text-white transition-colors relative flex items-center gap-2",
                activeFilter === 'growth-strategy' && "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
              )}
            >
              <TrendingUp className="w-4 h-4" />
              Growth Strategy
              {isFreeTier && <Lock className="w-4 h-4 text-yellow-500" />}
            </button>
            <button
              onClick={() => handleFilterChange('opportunities')}
              className={cn(
                "py-4 text-white/80 hover:text-white transition-colors relative flex items-center gap-2",
                activeFilter === 'opportunities' && "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
              )}
            >
              <BarChart3 className="w-4 h-4" />
              Opportunities
              {isFreeTier && <Lock className="w-4 h-4 text-yellow-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Key Insights Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Economic Growth</h3>
            <p className="text-white/60 text-sm mb-4">
              Track YoY GDP growth rates and market performance across regions
            </p>
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
              View Growth Map
            </Button>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Underserved Markets</h3>
            <p className="text-white/60 text-sm mb-4">
              Identify high-potential regions with low firm density
            </p>
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
              Find Opportunities
            </Button>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Market Specialization</h3>
            <p className="text-white/60 text-sm mb-4">
              Explore industry trends and specialization by region
            </p>
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
              View Trends
            </Button>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <MarketMetrics />
            <HeatmapSection activeFilter={activeFilter} />
            {activeFilter === 'market-entry' && <MarketEntryAnalysis />}
            {activeFilter === 'growth-strategy' && (
              isFreeTier ? (
                <div className="text-center p-8">
                  <Lock className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Premium Feature</h3>
                  <p className="text-white/60">Upgrade to access growth strategy analysis.</p>
                </div>
              ) : (
                <GrowthStrategyAnalysis />
              )
            )}
            {activeFilter === 'opportunities' && (
              isFreeTier ? (
                <div className="text-center p-8">
                  <Lock className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Premium Feature</h3>
                  <p className="text-white/60">Upgrade to access opportunity analysis.</p>
                </div>
              ) : (
                <OpportunityAnalysis />
              )
            )}
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <BuyerProfileManager />
          </div>
        </div>

        {/* Value-Added Insights */}
        <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Key Findings at a Glance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-blue-400 font-medium mb-1">Top Growth State</div>
              <div className="text-2xl font-bold text-white mb-1">Colorado</div>
              <div className="text-sm text-white/60">+54.7% growth in firm density</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-green-400 font-medium mb-1">Highest Employment</div>
              <div className="text-2xl font-bold text-white mb-1">California</div>
              <div className="text-sm text-white/60">150,000+ accountants</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-purple-400 font-medium mb-1">Emerging Market</div>
              <div className="text-2xl font-bold text-white mb-1">Wyoming</div>
              <div className="text-sm text-white/60">5.68 firm density, +34.6% growth</div>
            </div>
          </div>
        </Card>

        {/* Footer CTAs */}
        <div className="flex flex-wrap gap-4 justify-center pt-8">
          <Button variant="outline" className="border-white/10">
            Set Custom Alerts
          </Button>
          <Button variant="outline" className="border-white/10">
            Request Market Report
          </Button>
          <Button variant="outline" className="border-white/10">
            Compare Firms
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;