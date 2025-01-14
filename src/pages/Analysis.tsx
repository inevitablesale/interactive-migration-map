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
import { ListingsPanel } from "@/components/analytics/ListingsPanel";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MarketMetrics } from "@/components/analytics/MarketMetrics";

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
      <div className="w-full">
        {/* Navigation */}
        <div className="bg-black/40 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-8 px-6">
              <button
                onClick={() => handleFilterChange('market-entry')}
                className={cn(
                  "py-4 text-white/80 hover:text-white transition-colors relative",
                  activeFilter === 'market-entry' && "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
                )}
              >
                Market Entry
              </button>
              <button
                onClick={() => handleFilterChange('growth-strategy')}
                className={cn(
                  "py-4 text-white/80 hover:text-white transition-colors relative group",
                  activeFilter === 'growth-strategy' && "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
                )}
              >
                Growth Strategy
              </button>
              <button
                onClick={() => handleFilterChange('opportunities')}
                className={cn(
                  "py-4 text-white/80 hover:text-white transition-colors relative group",
                  activeFilter === 'opportunities' && "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
                )}
              >
                Opportunities
                {isFreeTier && (
                  <Lock className="w-4 h-4 inline-block ml-2 text-yellow-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <WelcomeSection />

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
              <ListingsPanel />
              <AlertsPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
