import { useState, useEffect } from "react";
import { Map, ChartBar, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function HeatmapTool() {
  const [selectedMetric, setSelectedMetric] = useState("employment");
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  
  const { data: stateData } = useQuery({
    queryKey: ['stateMetrics', selectedMetric, selectedStateId],
    queryFn: async () => {
      const query = supabase
        .from('state_data')
        .select('STATEFP, EMP, PAYANN, ESTAB, B19013_001E');
      
      if (selectedStateId) {
        query.eq('STATEFP', selectedStateId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: true
  });

  useEffect(() => {
    const handleStateSelection = (event: CustomEvent<{ stateId: string }>) => {
      setSelectedStateId(event.detail.stateId);
    };

    window.addEventListener('stateSelected', handleStateSelection as EventListener);
    return () => {
      window.removeEventListener('stateSelected', handleStateSelection as EventListener);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Map className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Market Heatmap</h3>
      </div>
      
      <Tabs defaultValue="density" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-white/5 p-1 rounded-lg mb-6">
          <TabsTrigger 
            value="density"
            className="data-[state=active]:bg-white/10 rounded-md transition-colors"
          >
            Firm Density
          </TabsTrigger>
          <TabsTrigger 
            value="growth"
            className="data-[state=active]:bg-white/10 rounded-md transition-colors"
          >
            Growth Trends
          </TabsTrigger>
          <TabsTrigger 
            value="payroll"
            className="data-[state=active]:bg-white/10 rounded-md transition-colors"
          >
            Payroll Analysis
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-6 rounded-lg">
            <div className="text-sm text-white/60 mb-2">Total Firms</div>
            <div className="text-3xl font-bold text-white">
              {stateData?.reduce((sum, state) => sum + (state.ESTAB || 0), 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white/5 p-6 rounded-lg">
            <div className="text-sm text-white/60 mb-2">Avg Employment</div>
            <div className="text-3xl font-bold text-white">
              {Math.round(stateData?.reduce((sum, state) => sum + (state.EMP || 0), 0) / (stateData?.length || 1)).toLocaleString()}
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}