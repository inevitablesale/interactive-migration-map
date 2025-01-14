import React from 'react';
import { Briefcase, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMetricColor } from '@/utils/market-report/formatters';
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ComprehensiveMarketData } from '@/types/rankings';

interface EmploymentMetricsCardProps {
  marketData: ComprehensiveMarketData;
}

export const EmploymentMetricsCard: React.FC<EmploymentMetricsCardProps> = ({ marketData }) => {
  const getEmploymentBadge = (value: number) => {
    if (value >= 1000000) return "Major Employment Hub";
    if (value >= 500000) return "Large Employment Base";
    if (value >= 100000) return "Mid-Size Market";
    return "Emerging Market";
  };

  const getSalaryBadge = (value: number) => {
    if (value >= 200000000) return "Premium Market";
    if (value >= 100000000) return "High-Value Market";
    if (value >= 50000000) return "Competitive Market";
    return "Developing Market";
  };

  const getRatioBadge = (value: number) => {
    if (value >= 3) return "Public Sector Dominant";
    if (value >= 2) return "Balanced Market";
    if (value >= 1) return "Private Sector Focus";
    return "Private Sector Dominant";
  };

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
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 flex items-center">
              Employed Population
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 ml-2 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Total number of employed individuals in the region</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </p>
            {marketData.employed_population && (
              <Badge className={`${getMetricColor(marketData.employed_population, 'population')}`}>
                {getEmploymentBadge(marketData.employed_population)}
              </Badge>
            )}
          </div>
          <p className={`text-xl font-bold ${getMetricColor(marketData.employed_population || 0, 'population')}`}>
            {marketData.employed_population?.toLocaleString() ?? 'N/A'}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 flex items-center">
              Average Accountant Salary
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 ml-2 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Average annual salary for accountants in the region</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </p>
            {marketData.avg_accountant_payroll && (
              <Badge className={`${getMetricColor(marketData.avg_accountant_payroll * 1000, 'money')}`}>
                {getSalaryBadge(marketData.avg_accountant_payroll * 1000)}
              </Badge>
            )}
          </div>
          <p className={`text-xl font-bold ${getMetricColor(marketData.avg_accountant_payroll * 1000 || 0, 'money')}`}>
            ${marketData.avg_accountant_payroll ? Math.round(marketData.avg_accountant_payroll * 1000).toLocaleString() : 'N/A'}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 flex items-center">
              Public/Private Sector Ratio
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 ml-2 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Ratio of public sector to private sector employment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </p>
            {marketData.public_to_private_ratio && (
              <Badge className={`${getMetricColor(marketData.public_to_private_ratio, 'density')}`}>
                {getRatioBadge(marketData.public_to_private_ratio)}
              </Badge>
            )}
          </div>
          <p className={`text-xl font-bold ${getMetricColor(marketData.public_to_private_ratio || 0, 'density')}`}>
            {marketData.public_to_private_ratio?.toFixed(2) ?? 'N/A'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};