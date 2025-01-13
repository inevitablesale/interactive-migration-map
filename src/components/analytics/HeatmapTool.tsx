import { useState, useEffect } from "react";
import { Map, ChartBar, TrendingUp, Users, Building2, DollarSign } from "lucide-react";
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

  const metrics = [
    {
      title: "Total Firms",
      value: stateData?.reduce((sum, state) => sum + (state.ESTAB || 0), 0).toLocaleString(),
      icon: Building2,
      change: "+5.2%",
      description: "Active firms in region"
    },
    {
      title: "Employment",
      value: stateData?.reduce((sum, state) => sum + (state.EMP || 0), 0).toLocaleString(),
      icon: Users,
      change: "+3.8%",
      description: "Total employees"
    },
    {
      title: "Annual Payroll",
      value: `$${(stateData?.reduce((sum, state) => sum + (state.PAYANN || 0), 0) / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      change: "+7.1%",
      description: "Total payroll volume"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div 
            key={metric.title}
            className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-100">{metric.title}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400">{metric.change}</span>
              <span className="text-xs text-blue-200/60">{metric.description}</span>
            </div>
          </div>
        ))}
      </div>
      
      <Card className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-white/10">
        <Tabs defaultValue="density" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-black/20 p-1 rounded-lg mb-6">
            <TabsTrigger 
              value="density"
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-md transition-colors"
            >
              Distribution
            </TabsTrigger>
            <TabsTrigger 
              value="growth"
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-md transition-colors"
            >
              Growth
            </TabsTrigger>
            <TabsTrigger 
              value="payroll"
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-md transition-colors"
            >
              Revenue
            </TabsTrigger>
          </TabsList>

          <div className="p-4">
            <div className="text-sm text-blue-100/60 mb-4">
              Market distribution analysis shows concentration of firms and economic activity across regions
            </div>
            {/* Placeholder for future chart/visualization */}
            <div className="h-48 bg-black/20 rounded-lg flex items-center justify-center">
              <span className="text-sm text-blue-200/40">Visualization Coming Soon</span>
            </div>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}