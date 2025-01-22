import { DollarSign, TrendingUp, Users, Building2, LineChart } from "lucide-react";
import { TopFirm } from "@/types/rankings";
import { ComprehensiveMarketData } from "@/types/rankings";

interface KeyMetricsBarProps {
  practice: TopFirm;
  countyData?: ComprehensiveMarketData;
}

export function KeyMetricsBar({ practice, countyData }: KeyMetricsBarProps) {
  // Estimate revenue based on industry standards and employee count
  const estimatedRevenue = practice.employee_count ? practice.employee_count * 150000 : 0;
  const estimatedEBITDA = estimatedRevenue * 0.15; // 15% margin assumption

  // Calculate growth classification based on growth rate compared to average
  const getGrowthClassification = (growthRate: number | undefined, avgGrowthRate: number | undefined) => {
    if (!growthRate) return 'Stable';
    if (!avgGrowthRate) return 'Stable';
    
    const difference = growthRate - avgGrowthRate;
    
    if (difference > 2) return 'High Growth';
    if (difference > 1) return 'Strong Growth';
    if (difference > 0) return 'Moderate Growth';
    if (difference > -1) return 'Stable Growth';
    return 'Declining';
  };

  // Get the actual growth rate and average from county data
  const growthRate = countyData?.population_growth_rate;
  const avgGrowthRate = countyData?.avg_growth_rate;

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
          <p className="text-sm text-white/60">Growth Rate</p>
          <p className="text-lg font-semibold text-white">
            {growthRate ? 
              `${growthRate.toFixed(1)}%` : 
              'N/A'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LineChart className="w-5 h-5 text-orange-400" />
        <div>
          <p className="text-sm text-white/60">Growth Status</p>
          <p className="text-lg font-semibold text-white">
            {getGrowthClassification(growthRate, avgGrowthRate)}
          </p>
        </div>
      </div>
    </div>
  );
}