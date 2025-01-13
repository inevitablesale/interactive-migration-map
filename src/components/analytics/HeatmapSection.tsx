import { useState } from "react";
import { Map, Filter, Building2, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalysisMap from "./AnalysisMap";

interface HeatmapSectionProps {
  activeFilter: string;
}

export const HeatmapSection = ({ activeFilter }: HeatmapSectionProps) => {
  const [selectedView, setSelectedView] = useState("density");

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Market Analysis</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-white/5 border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="bg-black/20 border-white/10">
          <TabsTrigger value="density" className="data-[state=active]:bg-blue-500/20">
            <Building2 className="w-4 h-4 mr-2" />
            Firm Density
          </TabsTrigger>
          <TabsTrigger value="growth" className="data-[state=active]:bg-blue-500/20">
            <TrendingUp className="w-4 h-4 mr-2" />
            Growth Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="density" className="mt-4">
          <div className="h-[500px] relative rounded-lg overflow-hidden">
            <AnalysisMap className="w-full h-full" />
          </div>
        </TabsContent>

        <TabsContent value="growth" className="mt-4">
          <div className="h-[500px] relative rounded-lg overflow-hidden">
            <AnalysisMap className="w-full h-full" />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};