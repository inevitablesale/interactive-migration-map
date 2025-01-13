import { useState } from "react";
import { Map, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataFilterToggle } from "./GeographicLevelToggle";
import AnalysisMap from "./AnalysisMap";

interface HeatmapSectionProps {
  activeFilter: string;
}

export const HeatmapSection = ({ activeFilter }: HeatmapSectionProps) => {
  const [selectedView, setSelectedView] = useState<'density' | 'migration'>("density");

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Market Analysis</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <DataFilterToggle 
            value={selectedView} 
            onChange={setSelectedView} 
          />
          <Button variant="outline" size="sm" className="bg-white/5 border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="h-[500px] relative rounded-lg overflow-hidden">
        <AnalysisMap 
          className="w-full h-full" 
          type={selectedView}
          geographicLevel="state"
        />
      </div>
    </Card>
  );
};