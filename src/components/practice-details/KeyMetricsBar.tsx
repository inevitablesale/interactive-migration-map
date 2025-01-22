import { DollarSign, TrendingUp, Users, Building2, LineChart } from "lucide-react";
import { TopFirm } from "@/types/rankings";
import { ComprehensiveMarketData } from "@/types/rankings";

interface KeyMetricsBarProps {
  practice: TopFirm;
  countyData?: ComprehensiveMarketData;
}

export function KeyMetricsBar({ practice, countyData }: KeyMetricsBarProps) {
  // Calculate revenue based on actual county payroll data
  const avgPayrollPerFirm = countyData?.payann && countyData?.total_establishments ? 
    (countyData.payann * 1000) / countyData.total_establishments : 
    175000; // Fallback to industry average if no data
    
  const estimatedRevenue = practice.employee_count ? practice.employee_count * avgPayrollPerFirm : 0;
  
  // EBITDA margins based on market saturation and competition
  const minEbitdaMargin = 0.15; // 15%
  const maxEbitdaMargin = 0.40; // 40%
  
  // Adjust EBITDA based on market conditions
  const marketSaturationFactor = countyData?.market_saturation || 0.2;
  const marketDensityFactor = (countyData?.firms_per_10k_population || 3) / 10;
  
  const currentEbitdaMargin = Math.min(
    maxEbitdaMargin,
    Math.max(
      minEbitdaMargin,
      0.20 + (0.05 * (1 - marketSaturationFactor)) - (0.02 * marketDensityFactor)
    )
  );

  const minEbitda = estimatedRevenue * minEbitdaMargin;
  const maxEbitda = estimatedRevenue * maxEbitdaMargin;
  const currentEbitda = estimatedRevenue * currentEbitdaMargin;

  // Calculate growth classification based on actual market data
  const getGrowthClassification = (growthRate: number | undefined, avgGrowthRate: number | undefined) => {
    if (!growthRate || !avgGrowthRate) return 'Data Unavailable';
    
    const difference = growthRate - avgGrowthRate;
    
    if (difference > 3) return 'Exceptional Growth';
    if (difference > 2) return 'High Growth';
    if (difference > 1) return 'Strong Growth';
    if (difference > 0) return 'Moderate Growth';
    if (difference > -1) return 'Stable';
    if (difference > -2) return 'Slow Growth';
    return 'Declining';
  };

  const growthRate = countyData?.population_growth_rate;
  const avgGrowthRate = countyData?.avg_growth_rate;

  const formatGrowthRate = (rate: number | undefined) => {
    if (!rate) return 'N/A';
    return `${rate.toFixed(1)}%`;
  };

  const gaugePosition = ((currentEbitdaMargin - minEbitdaMargin) / (maxEbitdaMargin - minEbitdaMargin)) * 100;

  return (
    <div className="grid grid-cols-5 gap-4 p-6 bg-black/40 backdrop-blur-md border-white/10 rounded-lg">
      <div className="flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-400" />
        <div>
          <p className="text-sm text-white/60">Annual Revenue</p>
          <p className="text-lg font-semibold text-white">${estimatedRevenue.toLocaleString()}</p>
          <p className="text-xs text-white/40">Based on market data</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5 text-blue-400" />
        <div>
          <p className="text-sm text-white/60">EBITDA Range</p>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-white">${currentEbitda.toLocaleString()}</p>
            <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-green-500"
                style={{ width: `${gaugePosition}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/60">
              <span>15%</span>
              <span>40%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-400" />
        <div>
          <p className="text-sm text-white/60">Employee Count</p>
          <p className="text-lg font-semibold text-white">{practice.employee_count}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-yellow-400" />
        <div>
          <p className="text-sm text-white/60">Growth Rates</p>
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-white">
              {formatGrowthRate(growthRate)}
            </p>
            <p className="text-xs text-white/60">
              Avg: {formatGrowthRate(avgGrowthRate)}
            </p>
          </div>
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