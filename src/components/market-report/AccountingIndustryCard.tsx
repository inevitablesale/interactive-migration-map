import React from 'react';
import { Building2, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getMetricColor } from '@/utils/market-report/formatters';
import type { ComprehensiveMarketData } from '@/types/rankings';

interface AccountingIndustryCardProps {
  marketData: ComprehensiveMarketData;
}

export const AccountingIndustryCard: React.FC<AccountingIndustryCardProps> = ({ marketData }) => {
  const getMetricBadge = (value: number, type: 'density' | 'employment' | 'payroll') => {
    const thresholds = {
      density: { high: 20, medium: 10 },
      employment: { high: 1000000, medium: 500000 },
      payroll: { high: 80000, medium: 60000 }
    };
    
    const t = thresholds[type];
    if (value > t.high) return { label: "High Performance", color: "bg-emerald-500/90 hover:bg-emerald-500/80" };
    if (value > t.medium) return { label: "Strong", color: "bg-blue-500/90 hover:bg-blue-500/80" };
    return { label: "Average", color: "bg-amber-500/90 hover:bg-amber-500/80" };
  };

  // Ensure we have valid numbers before calculations
  const avgPayrollPerFirm = marketData.payann && marketData.total_establishments 
    ? (marketData.payann * 1000) / marketData.total_establishments 
    : 0;

  const avgSalaryPerEmployee = marketData.payann && marketData.emp && marketData.emp > 0
    ? (marketData.payann * 1000) / marketData.emp
    : 0;

  // Calculate population-based growth rate
  const populationBasedGrowthRate = marketData.population_growth_rate || 0;

  // Format currency with K/M/B suffixes
  const formatCurrency = (value: number): string => {
    if (!value) return 'N/A';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toLocaleString()}`;
  };

  // Add console logs for debugging
  console.log('Market Data:', {
    payann: marketData.payann,
    total_establishments: marketData.total_establishments,
    emp: marketData.emp,
    avgPayrollPerFirm,
    avgSalaryPerEmployee,
    firms_per_10k_population: marketData.firms_per_10k_population,
    total_population: marketData.total_population,
    population_growth_rate: populationBasedGrowthRate
  });

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Building2 className="w-5 h-5 mr-2" />
          Accounting Industry Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <p className="text-gray-400">Growth Rate</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Population-based growth rate</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {populationBasedGrowthRate !== undefined && (
              <Badge className={`${getMetricBadge(populationBasedGrowthRate, 'density').color} text-white font-medium px-3 py-1`}>
                {getMetricBadge(populationBasedGrowthRate, 'density').label}
              </Badge>
            )}
          </div>
          <p className={`text-xl font-bold ${getMetricColor(populationBasedGrowthRate || 0, 'growth')}`}>
            {populationBasedGrowthRate ? `${populationBasedGrowthRate.toFixed(1)}%` : 'N/A'}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <p className="text-gray-400">Total Establishments</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Number of accounting firms per 10,000 residents</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {marketData.firms_per_10k_population !== undefined && marketData.firms_per_10k_population !== null && (
              <Badge className={`${getMetricBadge(marketData.firms_per_10k_population, 'density').color} text-white font-medium px-3 py-1`}>
                {getMetricBadge(marketData.firms_per_10k_population, 'density').label}
              </Badge>
            )}
          </div>
          <p className={`text-xl font-bold ${getMetricColor(marketData.firms_per_10k_population || 0, 'density')}`}>
            {marketData.firms_per_10k_population ? `${marketData.firms_per_10k_population.toFixed(1)} per 10k residents` : 'N/A'}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <p className="text-gray-400">Average Annual Payroll per Firm</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Total annual payroll divided by number of establishments</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {avgPayrollPerFirm > 0 && (
              <Badge className={`${getMetricBadge(avgPayrollPerFirm, 'payroll').color} text-white font-medium px-3 py-1`}>
                {getMetricBadge(avgPayrollPerFirm, 'payroll').label}
              </Badge>
            )}
          </div>
          <p className={`text-xl font-bold ${getMetricColor(avgPayrollPerFirm || 0, 'money')}`}>
            {formatCurrency(avgPayrollPerFirm)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};