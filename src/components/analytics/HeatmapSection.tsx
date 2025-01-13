import { useState, useEffect } from "react";
import { Map, Filter, Building2, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AnalysisMap from "./AnalysisMap";

interface HeatmapSectionProps {
  activeFilter: string;
}

export const HeatmapSection = ({ activeFilter }: HeatmapSectionProps) => {
  const [selectedView, setSelectedView] = useState("density");
  const { toast } = useToast();

  const { data: densityData } = useQuery({
    queryKey: ['firmDensity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_firm_density_metrics');
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load firm density data",
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
  });

  const { data: growthData } = useQuery({
    queryKey: ['growthTrends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_growth_trend_metrics');
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load growth trend data",
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
  });

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
            <AnalysisMap 
              className="w-full h-full" 
              data={densityData}
              type="density"
            />
          </div>
        </TabsContent>

        <TabsContent value="growth" className="mt-4">
          <div className="h-[500px] relative rounded-lg overflow-hidden">
            <AnalysisMap 
              className="w-full h-full" 
              data={growthData}
              type="growth"
            />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};