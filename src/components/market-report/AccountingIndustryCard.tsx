import React from 'react';
import { Building2, TrendingUp, DollarSign, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getMetricColor } from '@/utils/market-report/formatters';
import type { ComprehensiveMarketData } from '@/types/rankings';

interface AccountingIndustryCardProps {
  marketData: ComprehensiveMarketData;
}

export const AccountingIndustryCard: React.FC<AccountingIndustryCardProps> = ({ marketData }) => {
  const getMetricBadge = (value: number, type: 'density' | 'growth' | 'payroll') => {
    const thresholds = {
      density: { high: 20, medium: 10 },
      growth: { high: 5, medium: 0 },
      payroll: { high: 80, medium: 60 }
    };
    
    const t = thresholds[type];
    if (value > t.high) return <Badge className="bg-emerald-500">High Performance</Badge>;
    if (value > t.medium) return <Badge className="bg-blue-500">Strong</Badge>;
    return <Badge className="bg-yellow-500">Average</Badge>;
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
            {getMetricBadge(marketData.firms_per_10k_population || 0, 'density')}
          </div>
          <p className={`text-xl font-bold ${getMetricColor(marketData.firms_per_10k_population || 0, 'density')}`}>
            {marketData.firms_per_10k_population?.toFixed(1) ?? 'N/A'} per 10k residents
          </p>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <p className="text-gray-400">Employment</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Total employed population in accounting services</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {getMetricBadge(marketData.growth_rate_percentage || 0, 'growth')}
          </div>
          <p className={`text-xl font-bold ${getMetricColor(marketData.employed_population || 0, 'population')}`}>
            {marketData.employed_population?.toLocaleString() ?? 'N/A'}
          </p>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <p className="text-gray-400">Annual Payroll</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Average annual payroll per accounting employee</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {getMetricBadge(marketData.avg_accountant_payroll || 0, 'payroll')}
          </div>
          <p className={`text-xl font-bold ${getMetricColor(marketData.avg_accountant_payroll || 0, 'money')}`}>
            ${marketData.avg_accountant_payroll ? Math.round(marketData.avg_accountant_payroll * 1000).toLocaleString() : 'N/A'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};