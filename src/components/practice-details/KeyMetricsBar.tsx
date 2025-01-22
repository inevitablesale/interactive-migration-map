import { DollarSign, TrendingUp, Users, Building2, LineChart } from "lucide-react";
import { TopFirm } from "@/types/rankings";
import { ComprehensiveMarketData } from "@/types/rankings";

interface KeyMetricsBarProps {
  practice: TopFirm;
  countyData?: ComprehensiveMarketData;
}

export function KeyMetricsBar({ practice, countyData }: KeyMetricsBarProps) {
  // Estimate revenue based on industry standards for accounting firms
  // Average revenue per employee in accounting firms ranges from $150k to $200k
  const revenuePerEmployee = 175000; // Using industry average
  const estimatedRevenue = practice.employee_count ? practice.employee_count * revenuePerEmployee : 0;
  
  // EBITDA margins for accounting firms typically range from 15-25%
  const ebitdaMargin = 0.20; // Using 20% as a conservative estimate
  const estimatedEBITDA = estimatedRevenue * ebitdaMargin;

  // Calculate growth classification based on growth rate compared to average
  const getGrowthClassification = (growthRate: number | undefined, avgGrowthRate: number | undefined) => {
    if (!growthRate || !avgGrowthRate) return 'Data Unavailable';
    
    const difference = growthRate - avgGrowthRate;
    
    // Classification based on how much the growth rate exceeds the average
    if (difference > 3) return 'Exceptional Growth (>3% above avg)';
    if (difference > 2) return 'High Growth (2-3% above avg)';
    if (difference > 1) return 'Strong Growth (1-2% above avg)';
    if (difference > 0) return 'Moderate Growth (0-1% above avg)';
    if (difference > -1) return 'Stable (0-1% below avg)';
    if (difference > -2) return 'Slow Growth (1-2% below avg)';
    return 'Declining (>2% below avg)';
  };

  // Get the actual growth rate and average from county data
  const growthRate = countyData?.population_growth_rate;
  const avgGrowthRate = countyData?.avg_growth_rate;
  const totalPopulation = countyData?.total_population;

  // Format the growth rate display
  const formatGrowthRate = (rate: number | undefined) => {
    if (!rate) return 'N/A';
    return `${rate.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-5 gap-4 p-6 bg-black/40 backdrop-blur-md border-white/10 rounded-lg">
      <div className="flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-400" />
        <div>
          <p className="text-sm text-white/60">Annual Revenue*</p>
          <p className="text-lg font-semibold text-white">${estimatedRevenue.toLocaleString()}</p>
          <p className="text-xs text-white/40">*Industry average estimate</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5 text-blue-400" />
        <div>
          <p className="text-sm text-white/60">EBITDA (20%)*</p>
          <p className="text-lg font-semibold text-white">${estimatedEBITDA.toLocaleString()}</p>
          <p className="text-xs text-white/40">*Industry standard margin</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-400" />
        <div>
          <p className="text-sm text-white/60">Population</p>
          <p className="text-lg font-semibold text-white">{totalPopulation?.toLocaleString() || 'N/A'}</p>
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