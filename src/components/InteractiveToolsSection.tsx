import { useState } from "react";
import { ComparisonTool } from "./ComparisonTool";
import { HeatmapTool } from "./analytics/HeatmapTool";
import { PredictiveTools } from "./analytics/PredictiveTools";
import { OpportunityTools } from "./analytics/OpportunityTools";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import AnalysisMap from "./analytics/AnalysisMap";

export const InteractiveToolsSection = () => {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-0">
      {/* Analysis Map Section */}
      <div className="h-[calc(100vh-132px)] relative">
        <AnalysisMap className="h-full" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-transparent to-black/20" />
      </div>

      {/* Analysis Tools Section */}
      <div className="bg-black/30 backdrop-blur-md border-l border-white/10 h-[calc(100vh-132px)] overflow-y-auto">
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="w-full sticky top-0 z-10 bg-black/40 backdrop-blur-md p-4 grid grid-cols-4 gap-2">
            <TabsTrigger 
              value="insights" 
              className="bg-white/5 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-lg transition-all duration-200"
            >
              Insights
            </TabsTrigger>
            <TabsTrigger 
              value="predictive"
              className="bg-white/5 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-lg transition-all duration-200"
            >
              Predict
            </TabsTrigger>
            <TabsTrigger 
              value="opportunities"
              className="bg-white/5 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-lg transition-all duration-200"
            >
              Discover
            </TabsTrigger>
            <TabsTrigger 
              value="compare"
              className="bg-white/5 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-lg transition-all duration-200"
            >
              Compare
            </TabsTrigger>
          </TabsList>

          <div className="p-4 space-y-4">
            <TabsContent value="insights" className="mt-0 space-y-4">
              <HeatmapTool />
            </TabsContent>

            <TabsContent value="predictive" className="mt-0 space-y-4">
              <PredictiveTools />
            </TabsContent>

            <TabsContent value="opportunities" className="mt-0 space-y-4">
              <OpportunityTools />
            </TabsContent>

            <TabsContent value="compare" className="mt-0 space-y-4">
              <ComparisonTool />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};