import React from 'react';
import { Briefcase, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMetricColor } from '@/utils/market-report/formatters';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ComprehensiveMarketData } from '@/types/rankings';

interface EmploymentMetricsCardProps {
  marketData: ComprehensiveMarketData;
}

export const EmploymentMetricsCard: React.FC<EmploymentMetricsCardProps> = ({ marketData }) => {
  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Briefcase className="w-5 h-5 mr-2" />
          Employment Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-gray-400">Employed Population</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Total number of employed individuals in the region</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className={`text-xl font-bold ${getMetricColor(marketData.employed_population || 0, 'population')}`}>
            {marketData.employed_population?.toLocaleString() ?? 'N/A'}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-gray-400">Average Accountant Salary</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Average annual salary for accountants in the region</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className={`text-xl font-bold ${getMetricColor(marketData.avg_accountant_payroll * 1000 || 0, 'money')}`}>
            ${marketData.avg_accountant_payroll ? Math.round(marketData.avg_accountant_payroll * 1000).toLocaleString() : 'N/A'}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-gray-400">Public/Private Sector Ratio</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Ratio of public sector to private sector employment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className={`text-xl font-bold ${getMetricColor(marketData.public_to_private_ratio || 0, 'density')}`}>
            {marketData.public_to_private_ratio?.toFixed(2) ?? 'N/A'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};