import React from 'react';
import { Building2, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMetricColor } from '@/utils/market-report/formatters';
import type { ComprehensiveMarketData } from '@/types/rankings';

interface AccountingIndustryCardProps {
  marketData: ComprehensiveMarketData;
}

export const AccountingIndustryCard: React.FC<AccountingIndustryCardProps> = ({ marketData }) => {
  const getGrowthBadge = (value: number) => {
    if (value > 5) return <Badge className="bg-green-500">High Growth</Badge>;
    if (value > 0) return <Badge className="bg-blue-500">Growing</Badge>;
    return <Badge className="bg-yellow-500">Stable</Badge>;
  };

  const getDensityBadge = (value: number) => {
    if (value > 20) return <Badge className="bg-green-500">High Density</Badge>;
    if (value > 10) return <Badge className="bg-blue-500">Moderate</Badge>;
    return <Badge className="bg-yellow-500">Emerging</Badge>;
  };

  const getPayrollBadge = (value: number) => {
    if (value > 80) return <Badge className="bg-green-500">Premium</Badge>;
    if (value > 60) return <Badge className="bg-blue-500">Competitive</Badge>;
    return <Badge className="bg-yellow-500">Standard</Badge>;
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
            <p className="text-gray-400">Total Establishments</p>
            {getDensityBadge(marketData.firms_per_10k_population || 0)}
          </div>
          <p className={`text-xl font-bold ${getMetricColor(marketData.firms_per_10k_population || 0, 'density')}`}>
            {marketData.firms_per_10k_population?.toFixed(1) ?? 'N/A'} per 10k residents
          </p>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-gray-400">Employment</p>
            {getGrowthBadge(marketData.growth_rate_percentage || 0)}
          </div>
          <p className={`text-xl font-bold ${getMetricColor(marketData.employed_population || 0, 'population')}`}>
            {marketData.employed_population?.toLocaleString() ?? 'N/A'}
          </p>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-gray-400">Annual Payroll</p>
            {getPayrollBadge(marketData.avg_accountant_payroll || 0)}
          </div>
          <p className={`text-xl font-bold ${getMetricColor(marketData.avg_accountant_payroll || 0, 'money')}`}>
            ${marketData.avg_accountant_payroll ? Math.round(marketData.avg_accountant_payroll * 1000).toLocaleString() : 'N/A'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};