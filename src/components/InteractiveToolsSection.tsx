import { useState } from "react";
import { Brain, LineChart, Target, Filter, Search, ChartBar } from "lucide-react";
import { ComparisonTool } from "./ComparisonTool";
import { HeatmapTool } from "./analytics/HeatmapTool";
import { PredictiveTools } from "./analytics/PredictiveTools";
import { OpportunityTools } from "./analytics/OpportunityTools";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import AnalysisMap from "./analytics/AnalysisMap";

export const InteractiveToolsSection = () => {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="min-h-screen bg-black/95 relative z-20 px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
            Interactive Market Analysis
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Transform data into actionable insights with our comprehensive analysis tools
          </p>
        </div>

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
      </div>
    </div>
  );
};