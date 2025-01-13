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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
      {/* Analysis Map Section - Full height */}
      <div className="h-[calc(100vh-200px)] relative">
        <AnalysisMap className="h-full" />
      </div>

      {/* Analysis Tools Section */}
      <div className="bg-black/40 backdrop-blur-sm p-6 h-[calc(100vh-200px)] overflow-y-auto">
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-white/5 p-1 rounded-lg mb-6">
            <TabsTrigger 
              value="insights" 
              className="data-[state=active]:bg-white data-[state=active]:text-black rounded-md transition-colors"
            >
              Market Insights
            </TabsTrigger>
            <TabsTrigger 
              value="predictive"
              className="data-[state=active]:bg-white data-[state=active]:text-black rounded-md transition-colors"
            >
              Predictive
            </TabsTrigger>
            <TabsTrigger 
              value="opportunities"
              className="data-[state=active]:bg-white data-[state=active]:text-black rounded-md transition-colors"
            >
              Opportunities
            </TabsTrigger>
            <TabsTrigger 
              value="compare"
              className="data-[state=active]:bg-white data-[state=active]:text-black rounded-md transition-colors"
            >
              Compare
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-6">
            <HeatmapTool />
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            <PredictiveTools />
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <OpportunityTools />
          </TabsContent>

          <TabsContent value="compare" className="space-y-6">
            <ComparisonTool />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};