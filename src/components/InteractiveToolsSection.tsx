import { useState } from "react";
import { ComparisonTool } from "./ComparisonTool";
import { MarketOpportunities } from "./analytics/MarketOpportunities";
import { ActionableInsights } from "./analytics/ActionableInsights";
import { StrategyBuilder } from "./analytics/StrategyBuilder";
import { EnhancedAnalytics } from "./analytics/EnhancedAnalytics";
import { QueryBuilderPanel } from "./analytics/QueryBuilder/QueryBuilderPanel";
import { ReportsPanel } from "./analytics/ReportsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import AnalysisMap from "./analytics/AnalysisMap";
import { useSearchParams } from "react-router-dom";

export const InteractiveToolsSection = () => {
  const [showComparison, setShowComparison] = useState(false);
  const [searchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter');

  // Map filter values to tab values
  const getActiveTab = () => {
    switch (activeFilter) {
      case 'market-entry':
        return 'opportunities';
      case 'growth-strategy':
        return 'strategy';
      case 'reports':
        return 'reports';
      case 'builder':
        return 'builder';
      default:
        return 'opportunities';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-0">
      {/* Analysis Map Section */}
      <div className="h-[calc(100vh-100px)] relative">
        <AnalysisMap className="h-full" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-transparent to-black/20" />
      </div>

      {/* Analysis Tools Section */}
      <div className="bg-black/30 backdrop-blur-md border-l border-white/10 h-[calc(100vh-100px)] overflow-y-auto">
        <Tabs defaultValue={getActiveTab()} value={getActiveTab()} className="w-full">
          <TabsList className="w-full sticky top-0 z-10 bg-black/40 backdrop-blur-md p-6 grid grid-cols-4 gap-4">
            <TabsTrigger 
              value="opportunities" 
              className="bg-white/5 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-lg transition-all duration-200 px-4 py-2"
            >
              Find Opportunities
            </TabsTrigger>
            <TabsTrigger 
              value="strategy"
              className="bg-white/5 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-lg transition-all duration-200 px-4 py-2"
            >
              Build Strategy
            </TabsTrigger>
            <TabsTrigger 
              value="reports"
              className="bg-white/5 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-lg transition-all duration-200 px-4 py-2"
            >
              Community Reports
            </TabsTrigger>
            <TabsTrigger 
              value="builder"
              className="bg-white/5 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-lg transition-all duration-200 px-4 py-2"
            >
              Report Builder
            </TabsTrigger>
          </TabsList>

          <div className="p-6 space-y-6">
            <TabsContent value="opportunities" className="mt-0 space-y-6">
              <MarketOpportunities />
            </TabsContent>

            <TabsContent value="strategy" className="mt-0 space-y-6">
              <StrategyBuilder />
            </TabsContent>

            <TabsContent value="reports" className="mt-0 space-y-6">
              <ReportsPanel />
            </TabsContent>

            <TabsContent value="builder" className="mt-0 space-y-6">
              <QueryBuilderPanel />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};