import { DollarSign, TrendingUp, Users, Building2, LineChart, Info } from "lucide-react";
import { TopFirm } from "@/types/rankings";
import { ComprehensiveMarketData } from "@/types/rankings";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getFirmSizeCategory, getValuationMultiple } from "@/utils/valuationUtils";

interface KeyMetricsBarProps {
  practice: TopFirm;
  countyData?: ComprehensiveMarketData;
}

const getFirmSizeDisplay = (size: string) => {
  return size.charAt(0).toUpperCase() + size.slice(1);
};

export function KeyMetricsBar({ practice, countyData }: KeyMetricsBarProps) {
  // Calculate revenue based on industry standard payroll-to-revenue ratio
  const avgSalaryPerEmployee = countyData?.payann && countyData?.emp ? 
    (countyData.payann * 1000) / countyData.emp : 
    86259; // Fallback to county average if no data
    
  const annualPayroll = practice.employeeCount ? practice.employeeCount * avgSalaryPerEmployee : 0;
  const payrollToRevenueRatio = 0.35; // Industry standard: payroll is typically 35% of revenue
  const estimatedRevenue = annualPayroll * (1/payrollToRevenueRatio);

  console.log('KeyMetricsBar calculation:', {
    employeeCount: practice.employeeCount,
    avgSalaryPerEmployee,
    annualPayroll,
    estimatedRevenue,
    countyData: {
      payann: countyData?.payann,
      emp: countyData?.emp
    }
  });

  const firmSize = getFirmSizeCategory(practice.employeeCount || 0);
  const valuationMultiple = getValuationMultiple(firmSize, estimatedRevenue);
  const estimatedValuation = estimatedRevenue * valuationMultiple;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const formatGrowthRate = (rate: number | undefined) => {
    if (!rate) return 'N/A';
    return `${(rate / 10).toFixed(1)}%`;
  };

  const MetricCard = ({ 
    icon: Icon, 
    iconColor, 
    title, 
    value, 
    subtitle,
    tooltip
  }: { 
    icon: any, 
    iconColor: string, 
    title: string, 
    value: string, 
    subtitle?: string,
    tooltip?: string 
  }) => (
    <div className="group relative flex flex-col justify-between p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-white/80">{title}</p>
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-white/40 hover:text-white/60 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-white/50 mt-2 font-medium">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-3 gap-6 p-8 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl border border-white/10 rounded-xl">
      <MetricCard
        icon={DollarSign}
        iconColor="bg-emerald-400/10 text-emerald-400"
        title="Est. Gross Revenue"
        value={formatCurrency(estimatedRevenue)}
        subtitle="Based on payroll data"
        tooltip="Estimated based on industry standards"
      />
      
      <MetricCard
        icon={TrendingUp}
        iconColor="bg-yellow-400/10 text-yellow-400"
        title="Growth Rates"
        value={formatGrowthRate(countyData?.population_growth_rate)}
        subtitle={`Avg: ${formatGrowthRate(countyData?.avg_growth_rate)}`}
        tooltip="Population Growth Rate\nCompared to state average"
      />
      
      <MetricCard
        icon={LineChart}
        iconColor="bg-orange-400/10 text-orange-400"
        title="Est. Valuation"
        value={formatCurrency(estimatedValuation)}
        subtitle={`Based on Revenue × ${valuationMultiple.toFixed(2)}`}
        tooltip="Based on industry multiples"
      />
    </div>
  );
}