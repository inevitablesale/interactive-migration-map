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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Analysis Map Section */}
      <div className="h-[600px] relative rounded-lg overflow-hidden border border-white/10">
        <AnalysisMap className="h-full" />
      </div>

      {/* Analysis Tools Section */}
      <div className="space-y-8">
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="insights">Market Insights</TabsTrigger>
            <TabsTrigger value="predictive">Predictive</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-8">
            <HeatmapTool />
          </TabsContent>

          <TabsContent value="predictive" className="space-y-8">
            <PredictiveTools />
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-8">
            <OpportunityTools />
          </TabsContent>

          <TabsContent value="compare" className="space-y-8">
            <ComparisonTool />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};