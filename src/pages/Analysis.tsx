import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { InteractiveToolsSection } from "@/components/InteractiveToolsSection";
import { WelcomeSection } from "@/components/analytics/WelcomeSection";
import { HeatmapSection } from "@/components/analytics/HeatmapSection";
import { MarketEntryAnalysis } from "@/components/analytics/market-entry/MarketEntryAnalysis";
import { GrowthStrategyAnalysis } from "@/components/analytics/growth/GrowthStrategyAnalysis";
import { OpportunityAnalysis } from "@/components/analytics/opportunities/OpportunityAnalysis";
import { AlertsPanel } from "@/components/analytics/AlertsPanel";
import { BuyerProfileManager } from "@/components/analytics/BuyerProfileManager";
import { ComparablesPanel } from "@/components/analytics/ComparablesPanel";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lock, ArrowRight, BarChart3, Map as MapIcon, LineChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MarketMetrics } from "@/components/analytics/MarketMetrics";
import { Button } from "@/components/ui/button";

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

  const renderAnalysisContent = () => {
    switch (activeFilter) {
      case 'market-entry':
        return <MarketEntryAnalysis />;
      case 'growth-strategy':
        return isFreeTier ? (
          <div className="text-center p-8">
            <Lock className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Premium Feature</h3>
            <p className="text-white/60">Upgrade to access growth strategy analysis.</p>
          </div>
        ) : (
          <GrowthStrategyAnalysis />
        );
      case 'opportunities':
        return isFreeTier ? (
          <div className="text-center p-8">
            <Lock className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Premium Feature</h3>
            <p className="text-white/60">Upgrade to access opportunity analysis.</p>
          </div>
        ) : (
          <OpportunityAnalysis />
        );
      default:
        return <MarketEntryAnalysis />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section */}
      <div className="relative bg-black/40 backdrop-blur-md border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Turn Market Insights into Your
              <span className="block text-blue-400">Competitive Advantage</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Discover actionable intelligence from 545 regions and 1.4M+ data points,
              tailored to your acquisition goals.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button 
                size="lg"
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => handleFilterChange('market-entry')}
              >
                Analyze My Market
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/10"
                onClick={() => handleFilterChange('opportunities')}
              >
                Compare Opportunities
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="border-b border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
              <BarChart3 className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Total Markets</p>
                <p className="text-2xl font-semibold text-white">545</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
              <MapIcon className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Data Points</p>
                <p className="text-2xl font-semibold text-white">1.4M+</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
              <LineChart className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Growth Rate</p>
                <p className="text-2xl font-semibold text-white">+12.4%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <MarketMetrics />
            <HeatmapSection activeFilter={activeFilter} />
            {renderAnalysisContent()}
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <BuyerProfileManager />
            <ComparablesPanel />
            <AlertsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;