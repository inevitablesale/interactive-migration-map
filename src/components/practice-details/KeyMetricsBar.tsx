import { DollarSign, TrendingUp, Users, Building2, LineChart, Info } from "lucide-react";
import { TopFirm } from "@/types/rankings";
import { ComprehensiveMarketData } from "@/types/rankings";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface KeyMetricsBarProps {
  practice: TopFirm;
  countyData?: ComprehensiveMarketData;
}

const getFirmSizeCategory = (employeeCount: number) => {
  if (employeeCount <= 5) return 'small';
  if (employeeCount <= 20) return 'medium';
  return 'large';
};

const getSDEParameters = (firmSize: string) => {
  switch (firmSize) {
    case 'small':
      return {
        ownerCompRatio: 0.40, // 40% of revenue
        operatingExpenseRatio: 0.25, // 25% of revenue
        sdeMargin: 0.45 // 45% of revenue
      };
    case 'medium':
      return {
        ownerCompRatio: 0.30, // 30% of revenue
        operatingExpenseRatio: 0.30, // 30% of revenue
        sdeMargin: 0.40 // 40% of revenue
      };
    case 'large':
      return {
        ownerCompRatio: 0.20, // 20% of revenue
        operatingExpenseRatio: 0.35, // 35% of revenue
        sdeMargin: 0.35 // 35% of revenue
      };
    default:
      return {
        ownerCompRatio: 0.40,
        operatingExpenseRatio: 0.25,
        sdeMargin: 0.45
      };
  }
};

const getValuationMultiple = (firmSize: string, revenue: number) => {
  // Base multiple starts at the lower end for very small firms
  let baseMultiple = 0.71; // Starting at the lower end of revenue multiple range

  // Size adjustments
  switch (firmSize) {
    case 'small':
      baseMultiple = 0.71; // Lower end for small firms
      break;
    case 'medium':
      baseMultiple = 0.85; // Middle range
      break;
    case 'large':
      baseMultiple = 1.00; // Higher end for larger firms
      break;
  }

  // Revenue scale adjustments
  if (revenue > 5000000) baseMultiple += 0.05;
  if (revenue > 10000000) baseMultiple += 0.04;

  // Cap at the maximum industry multiple
  return Math.min(1.09, baseMultiple);
};

export function KeyMetricsBar({ practice, countyData }: KeyMetricsBarProps) {
  // Calculate revenue based on industry standard payroll-to-revenue ratio
  const avgSalaryPerEmployee = countyData?.payann && countyData?.emp ? 
    (countyData.payann * 1000) / countyData.emp : 
    86259; // Fallback to county average if no data
    
  const annualPayroll = practice.employeeCount ? practice.employeeCount * avgSalaryPerEmployee : 0;
  const payrollToRevenueRatio = 0.35; // Industry standard: payroll is typically 35% of revenue
  const estimatedRevenue = annualPayroll / payrollToRevenueRatio;

  const firmSize = getFirmSizeCategory(practice.employeeCount || 0);
  const sdeParams = getSDEParameters(firmSize);

  // Calculate SDE components based on firm size
  const ownerCompensation = estimatedRevenue * sdeParams.ownerCompRatio;
  const operatingExpenses = estimatedRevenue * sdeParams.operatingExpenseRatio;
  const sde = estimatedRevenue * sdeParams.sdeMargin;

  // Calculate EBITDA (typically 70-75% of SDE for accounting firms)
  const ebitdaRatio = 0.70;
  const ebitda = sde * ebitdaRatio;

  // Calculate valuation using revenue multiple based on firm size
  const valuationMultiple = getValuationMultiple(firmSize, estimatedRevenue);
  const estimatedValuation = estimatedRevenue * valuationMultiple;

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

  return (
    <div className="grid grid-cols-5 gap-4 p-6 bg-black/40 backdrop-blur-md border-white/10 rounded-lg">
      <div className="group relative flex flex-col justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-white/60">Est. Gross Revenue</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-white/40 hover:text-white/60 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Estimated based on industry standards</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold text-white tracking-tight">{formatCurrency(estimatedRevenue)}</p>
          <p className="text-xs text-white/40 mt-1">Based on payroll data</p>
        </div>
      </div>

      <div className="group relative flex flex-col justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-white/60">Est. SDE</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-white/40 hover:text-white/60 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Seller's Discretionary Earnings</p>
                    <p className="text-xs text-gray-400">Based on {firmSize} firm benchmarks</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold text-white tracking-tight">{formatCurrency(sde)}</p>
        </div>
      </div>

      <div className="group relative flex flex-col justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-white/60">Est. EBITDA</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-white/40 hover:text-white/60 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">70% of SDE for accounting firms</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold text-white tracking-tight">{formatCurrency(ebitda)}</p>
        </div>
      </div>

      <div className="group relative flex flex-col justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-white/60">Growth Rates</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-white/40 hover:text-white/60 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Population Growth Rate</p>
                    <p className="text-xs text-gray-400">Compared to state average</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold text-white tracking-tight">
            {formatGrowthRate(countyData?.population_growth_rate)}
          </p>
          <p className="text-xs text-white/40 mt-1">
            Avg: {formatGrowthRate(countyData?.avg_growth_rate)}
          </p>
        </div>
      </div>

      <div className="group relative flex flex-col justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-orange-400" />
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-white/60">Est. Valuation</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-white/40 hover:text-white/60 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Based on industry multiples</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold text-white tracking-tight">
            {formatCurrency(estimatedValuation)}
          </p>
          <p className="text-xs text-white/40 mt-1">
            Based on Revenue × {valuationMultiple.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}