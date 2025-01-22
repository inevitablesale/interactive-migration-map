import { DollarSign, TrendingUp, Users, Building2, LineChart } from "lucide-react";
import { TopFirm } from "@/types/rankings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface KeyMetricsBarProps {
  practice: TopFirm;
}

export function KeyMetricsBar({ practice }: KeyMetricsBarProps) {
  // Estimate revenue based on industry standards and employee count
  const estimatedRevenue = practice.employee_count ? practice.employee_count * 150000 : 0;
  const estimatedEBITDA = estimatedRevenue * 0.15; // 15% margin assumption

  // Fetch growth metrics for the practice's location
  const { data: growthMetrics } = useQuery({
    queryKey: ['growth-metrics', practice.COUNTYFP, practice.STATEFP],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_comprehensive_growth_metrics');
      if (error) throw error;
      
      // Find the matching county data
      return data.find(
        metric => 
          metric.countyfp === practice.COUNTYFP?.toString() && 
          metric.statefp === practice.STATEFP?.toString()
      );
    },
    enabled: !!practice.COUNTYFP && !!practice.STATEFP
  });

  return (
    <div className="grid grid-cols-5 gap-4 p-6 bg-black/40 backdrop-blur-md border-white/10 rounded-lg">
      <div className="flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-400" />
        <div>
          <p className="text-sm text-white/60">Est. Revenue</p>
          <p className="text-lg font-semibold text-white">${estimatedRevenue.toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5 text-blue-400" />
        <div>
          <p className="text-sm text-white/60">Est. EBITDA</p>
          <p className="text-lg font-semibold text-white">${estimatedEBITDA.toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-400" />
        <div>
          <p className="text-sm text-white/60">Employees</p>
          <p className="text-lg font-semibold text-white">{practice.employee_count || 'N/A'}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-yellow-400" />
        <div>
          <p className="text-sm text-white/60">Growth Score</p>
          <p className="text-lg font-semibold text-white">
            {growthMetrics ? `${growthMetrics.composite_growth_score}%` : 'N/A'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LineChart className="w-5 h-5 text-orange-400" />
        <div>
          <p className="text-sm text-white/60">Growth Status</p>
          <p className="text-lg font-semibold text-white">
            {growthMetrics?.growth_classification || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}