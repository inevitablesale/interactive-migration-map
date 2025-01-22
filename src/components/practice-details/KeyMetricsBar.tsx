import { DollarSign, TrendingUp, Users, Building2, LineChart, Info } from "lucide-react";
import { TopFirm } from "@/types/rankings";
import { ComprehensiveMarketData } from "@/types/rankings";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface KeyMetricsBarProps {
  practice: TopFirm;
  countyData?: ComprehensiveMarketData;
}

export function KeyMetricsBar({ practice, countyData }: KeyMetricsBarProps) {
  // Calculate revenue based on industry standard payroll-to-revenue ratio
  const avgSalaryPerEmployee = countyData?.payann && countyData?.emp ? 
    (countyData.payann * 1000) / countyData.emp : 
    86259; // Fallback to county average if no data
    
  const annualPayroll = practice.employee_count ? practice.employee_count * avgSalaryPerEmployee : 0;
  const payrollToRevenueRatio = 0.35; // Industry standard: payroll is typically 35% of revenue
  const estimatedRevenue = annualPayroll / payrollToRevenueRatio;

  // Calculate SDE components
  const ownerCompensation = Math.min(250000, estimatedRevenue * 0.15); // Cap at 250k
  const nonRecurringExpenses = estimatedRevenue * 0.02; // Estimated at 2% of revenue
  const depreciation = estimatedRevenue * 0.05; // Estimated at 5% of revenue
  const discretionaryExpenses = estimatedRevenue * 0.03; // Estimated at 3% of revenue

  // Calculate SDE
  const sde = estimatedRevenue - 
    (annualPayroll - ownerCompensation) - // Remove payroll but add back owner's comp
    (estimatedRevenue * 0.20) + // Standard operating expenses (20% of revenue)
    nonRecurringExpenses +
    depreciation +
    discretionaryExpenses;
  
  // EBITDA margins based on market saturation and competition
  const minEbitdaMargin = 0.15; // 15%
  const maxEbitdaMargin = 0.40; // 40%
  
  // Adjust EBITDA based on market conditions
  const marketSaturationFactor = countyData?.avg_market_saturation || 0.2;
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

  // Calculate valuation multiple based on various factors
  const baseMultiple = 2.99; // Starting at the lower end of EBITDA multiple range
  
  // Growth rate adjustment (+0.1x for every 5% above average)
  const growthRate = countyData?.population_growth_rate || 0;
  const avgGrowthRate = countyData?.avg_growth_rate || 0;
  const growthAdjustment = Math.max(0, ((growthRate - avgGrowthRate) / 5) * 0.1);

  // Market saturation adjustment (negative for saturated markets)
  const marketSaturationAdjustment = Math.max(-0.2, (0.5 - (marketSaturationFactor || 0)) * 0.4);

  // Size premium for larger firms
  const sizePremium = practice.employee_count >= 20 ? 0.2 : 0;

  // Calculate final multiple
  const valuationMultiple = Math.min(4.45, // Cap at max industry EBITDA multiple
    baseMultiple + growthAdjustment + marketSaturationAdjustment + sizePremium
  );

  // Calculate estimated valuation using EBITDA
  const estimatedValuation = currentEbitda * valuationMultiple;

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

  const formatGrowthRate = (rate: number | undefined) => {
    if (!rate) return 'N/A';
    return `${(rate / 10).toFixed(1)}%`;
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const gaugePosition = ((currentEbitdaMargin - minEbitdaMargin) / (maxEbitdaMargin - minEbitdaMargin)) * 100;

  return (
    <div className="grid grid-cols-5 gap-4 p-6 bg-black/40 backdrop-blur-md border-white/10 rounded-lg">
      <div className="flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-400" />
        <div>
          <div className="flex items-center gap-1">
            <p className="text-sm text-white/60">Est. Gross Revenue</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Estimated based on industry standards</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-lg font-semibold text-white">{formatCurrency(estimatedRevenue)}</p>
          <p className="text-xs text-white/40">Based on payroll data</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5 text-blue-400" />
        <div>
          <div className="flex items-center gap-1">
            <p className="text-sm text-white/60">Est. SDE</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Seller's Discretionary Earnings</p>
                  <p className="text-xs text-gray-400">Includes add-backs for owner's comp and non-recurring expenses</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-lg font-semibold text-white">{formatCurrency(sde)}</p>
          <p className="text-xs text-white/40">Multiple: {valuationMultiple.toFixed(2)}x</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-400" />
        <div>
          <div className="flex items-center gap-1">
            <p className="text-sm text-white/60">Est. EBITDA</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Earnings Before Interest, Taxes, Depreciation & Amortization</p>
                  <p className="text-xs text-gray-400">Range: {formatCurrency(minEbitda)} - {formatCurrency(maxEbitda)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-lg font-semibold text-white">{formatCurrency(currentEbitda)}</p>
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-green-500"
              style={{ width: `${gaugePosition}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-yellow-400" />
        <div>
          <div className="flex items-center gap-1">
            <p className="text-sm text-white/60">Growth Rates</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Population Growth Rate</p>
                  <p className="text-xs text-gray-400">Compared to state average</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
          <p className="text-sm text-white/60">Est. Valuation</p>
          <p className="text-lg font-semibold text-white">
            {formatCurrency(estimatedValuation)}
          </p>
          <p className="text-xs text-white/60">
            Based on EBITDA × {valuationMultiple.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}