import { useState, useEffect } from "react";
import { Map, ChartBar, TrendingUp, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function HeatmapTool() {
  const [selectedMetric, setSelectedMetric] = useState("density");
  const { toast } = useToast();
  const [toastShown, setToastShown] = useState(false);
  
  // Listen for state selection from map
  useEffect(() => {
    const handleStateChange = (event: CustomEvent) => {
      const stateData = event.detail;
      if (stateData && !toastShown) {
        toast({
          title: "Region Selection",
          description: `Click multiple states to create a custom region for analysis`,
        });
        setToastShown(true);
      }
    };

    window.addEventListener('stateChanged', handleStateChange as EventListener);
    return () => window.removeEventListener('stateChanged', handleStateChange as EventListener);
  }, [toast, toastShown]);

  const { data: stateData } = useQuery({
    queryKey: ['stateMetrics', selectedMetric],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_data')
        .select('STATEFP, EMP, PAYANN, ESTAB');
      
      if (error) throw error;
      return data;
    }
  });

  const totalFirms = stateData?.reduce((sum, state) => sum + (state.ESTAB || 0), 0) || 0;
  const avgEmployment = Math.round(
    stateData?.reduce((sum, state) => sum + (state.EMP || 0), 0) / (stateData?.length || 1)
  );

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Market Heatmap</h3>
        </div>
      </div>
      
      <Tabs defaultValue="density" className="w-full" onValueChange={setSelectedMetric}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="density">Firm Density</TabsTrigger>
          <TabsTrigger value="growth">Growth Trends</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="density" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/30 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-yellow-400" />
                <div className="text-sm text-white/60">Total Firms</div>
              </div>
              <div className="text-3xl font-bold text-white">
                {totalFirms.toLocaleString()}
              </div>
              <div className="text-xs text-white/40 mt-1">
                Active accounting practices
              </div>
            </div>
            <div className="bg-black/30 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ChartBar className="w-4 h-4 text-yellow-400" />
                <div className="text-sm text-white/60">Avg Employment</div>
              </div>
              <div className="text-3xl font-bold text-white">
                {avgEmployment.toLocaleString()}
              </div>
              <div className="text-xs text-white/40 mt-1">
                Employees per firm
              </div>
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-lg">
            <div className="text-sm text-white/60 mb-2">Next Steps</div>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                Select states on the map to analyze specific markets
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                Compare metrics across different regions
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                Use predictive tools to forecast growth potential
              </li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="growth">
          <div className="bg-black/30 p-6 rounded-lg text-center">
            <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h4 className="text-white font-medium mb-2">Growth Analysis</h4>
            <p className="text-white/60 text-sm">
              Select states on the map to view detailed growth trends and forecasts
            </p>
          </div>
        </TabsContent>

        <TabsContent value="payroll">
          <div className="bg-black/30 p-6 rounded-lg text-center">
            <ChartBar className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h4 className="text-white font-medium mb-2">Payroll Insights</h4>
            <p className="text-white/60 text-sm">
              Select states on the map to analyze compensation trends and benchmarks
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
