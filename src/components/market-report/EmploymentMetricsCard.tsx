import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { getMetricColor } from "@/utils/market-report/formatters";
import type { ComprehensiveMarketData } from "@/types/rankings";

interface EmploymentMetricsCardProps {
  marketData: ComprehensiveMarketData;
}

export function EmploymentMetricsCard({ marketData }: EmploymentMetricsCardProps) {
  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Users className="w-5 h-5 mr-2" />
          Employment Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-white/60">Employed Population</span>
            <span className="text-white font-medium">
              {marketData.employed_population?.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm text-white/60">Private Sector Accountants</span>
            <span className="text-white font-medium">
              {marketData.private_sector_accountants?.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm text-white/60">Public Sector Accountants</span>
            <span className="text-white font-medium">
              {marketData.public_sector_accountants?.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm text-white/60">Average Accountant Salary</span>
            <span className={`text-white font-medium ${getMetricColor(marketData.avg_accountant_payroll || 0, 'money')}`}>
              ${marketData.avg_accountant_payroll?.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm text-white/60">Public/Private Ratio</span>
            <span className={`text-white font-medium ${getMetricColor(marketData.public_to_private_ratio || 0, 'density')}`}>
              {marketData.public_to_private_ratio?.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}