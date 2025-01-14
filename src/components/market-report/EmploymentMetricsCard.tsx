import React from 'react';
import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMetricColor } from '@/utils/market-report/formatters';
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
          <p className="text-gray-400">Employed Population</p>
          <p className={`text-xl font-bold ${getMetricColor(marketData.employed_population || 0, 'population')}`}>
            {marketData.employed_population?.toLocaleString() ?? 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Average Accountant Salary</p>
          <p className={`text-xl font-bold ${getMetricColor(marketData.avg_accountant_payroll || 0, 'money')}`}>
            ${marketData.avg_accountant_payroll ? Math.round(marketData.avg_accountant_payroll * 1000).toLocaleString() : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Public/Private Sector Ratio</p>
          <p className={`text-xl font-bold ${getMetricColor(marketData.public_to_private_ratio || 0, 'density')}`}>
            {marketData.public_to_private_ratio?.toFixed(2) ?? 'N/A'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};