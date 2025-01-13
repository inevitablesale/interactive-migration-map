import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Users, Building2, DollarSign } from "lucide-react";

export function AnalyticsDashboard() {
  const { data: marketMetrics } = useQuery({
    queryKey: ['marketMetrics'],
    queryFn: async () => {
      const { data: stateData, error } = await supabase
        .from('state_data')
        .select('EMP, PAYANN, ESTAB, B19013_001E')
        .order('EMP', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return stateData;
    }
  });

  const metrics = [
    {
      title: "Market Opportunity",
      value: marketMetrics?.reduce((sum, state) => sum + (state.ESTAB || 0), 0)?.toLocaleString() || "...",
      change: "+12%",
      icon: TrendingUp,
      description: "Active firms in target markets",
      action: "Identify high-growth regions"
    },
    {
      title: "Total Addressable Market",
      value: `$${(marketMetrics?.reduce((sum, state) => sum + (state.PAYANN || 0), 0) / 1e9)?.toFixed(1)}B` || "...",
      change: "+8.3%",
      icon: DollarSign,
      description: "Annual revenue potential",
      action: "Analyze revenue streams"
    },
    {
      title: "Competition Level",
      value: "Medium",
      change: "Stable",
      icon: Users,
      description: "Based on market density",
      action: "Review competitive landscape"
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="grid gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="p-4 bg-black/40 border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <metric.icon className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-medium text-white">{metric.title}</h3>
              </div>
              <span className="text-xs text-green-400">{metric.change}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{metric.description}</span>
              <button className="text-xs text-blue-400 hover:text-blue-300">
                {metric.action} →
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}