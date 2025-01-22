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

  // Fetch county rankings data for the practice's location
  const { data: countyData } = useQuery({
    queryKey: ['county-rankings', practice.COUNTYFP, practice.STATEFP],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('county_rankings')
        .select('*')
        .eq('countyfp', practice.COUNTYFP)
        .eq('statefp', practice.STATEFP)
        .maybeSingle();

      if (error) {
        console.error('Error fetching county rankings:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!practice.COUNTYFP && !!practice.STATEFP
  });

  // Calculate growth classification based on growth rate
  const getGrowthClassification = (growthRate: number | undefined) => {
    if (!growthRate) return 'Stable';
    if (growthRate > 5) return 'High Growth';
    if (growthRate > 2) return 'Moderate Growth';
    return 'Stable';
  };

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
            {countyData?.growth_rate ? 
              `${Math.round(countyData.growth_rate)}%` : 
              'N/A'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LineChart className="w-5 h-5 text-orange-400" />
        <div>
          <p className="text-sm text-white/60">Growth Status</p>
          <p className="text-lg font-semibold text-white">
            {getGrowthClassification(countyData?.growth_rate)}
          </p>
        </div>
      </div>
    </div>
  );
}