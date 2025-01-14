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

  // Calculate average payroll per firm
  const avgPayrollPerFirm = marketData.avg_accountant_payroll && marketData.firms_per_10k_population
    ? Math.round(marketData.avg_accountant_payroll)
    : null;

  // Calculate average salary per employee (total payroll / total employed)
  const avgSalaryPerEmployee = marketData.avg_accountant_payroll && marketData.employed_population
    ? Math.round(marketData.avg_accountant_payroll / marketData.employed_population)
    : null;

  // Format currency with K/M/B suffixes
  const formatCurrency = (value: number): string => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toLocaleString()}`;
  };

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
            {marketData.firms_per_10k_population && (
              <Badge className={`${getMetricBadge(marketData.firms_per_10k_population, 'density').color} text-white font-medium px-3 py-1`}>
                {getMetricBadge(marketData.firms_per_10k_population, 'density').label}
              </Badge>
            )}
          </div>
          <p className={`text-xl font-bold ${getMetricColor(marketData.firms_per_10k_population || 0, 'density')}`}>
            {marketData.firms_per_10k_population?.toFixed(1) ?? 'N/A'} per 10k residents
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
                    <p className="text-sm">Average annual payroll per accounting firm</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {avgPayrollPerFirm && (
              <Badge className={`${getMetricBadge(avgPayrollPerFirm, 'payroll').color} text-white font-medium px-3 py-1`}>
                {getMetricBadge(avgPayrollPerFirm, 'payroll').label}
              </Badge>
            )}
          </div>
          <p className={`text-xl font-bold ${getMetricColor(avgPayrollPerFirm || 0, 'money')}`}>
            {avgPayrollPerFirm ? formatCurrency(avgPayrollPerFirm) : 'N/A'}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <p className="text-gray-400">Average Salary per Employee</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Average salary per employee in accounting firms</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {avgSalaryPerEmployee && (
              <Badge className={`${getMetricBadge(avgSalaryPerEmployee, 'payroll').color} text-white font-medium px-3 py-1`}>
                {getMetricBadge(avgSalaryPerEmployee, 'payroll').label}
              </Badge>
            )}
          </div>
          <p className={`text-xl font-bold ${getMetricColor(avgSalaryPerEmployee || 0, 'money')}`}>
            {avgSalaryPerEmployee ? formatCurrency(avgSalaryPerEmployee) : 'N/A'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};