import { useState } from "react";
import { Map, ChartBar, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function HeatmapTool() {
  const [selectedMetric, setSelectedMetric] = useState("employment");
  
  const { data: stateData } = useQuery({
    queryKey: ['stateMetrics', selectedMetric],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_data')
        .select('STATEFP, EMP, PAYANN, ESTAB, B19013_001E');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Market Heatmap</h3>
        </div>
      </div>
      
      <Tabs defaultValue="density" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="density">Firm Density</TabsTrigger>
          <TabsTrigger value="growth">Growth Trends</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="density" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded">
              <div className="text-sm text-white/60 mb-2">Total Firms</div>
              <div className="text-2xl font-bold text-white">
                {stateData?.reduce((sum, state) => sum + (state.ESTAB || 0), 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded">
              <div className="text-sm text-white/60 mb-2">Avg Employment</div>
              <div className="text-2xl font-bold text-white">
                {Math.round(stateData?.reduce((sum, state) => sum + (state.EMP || 0), 0) / (stateData?.length || 1)).toLocaleString()}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}