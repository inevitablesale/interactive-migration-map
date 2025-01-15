import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import type { ComprehensiveMarketData } from "@/types/rankings";

interface EmploymentMetricsCardProps {
  marketData: ComprehensiveMarketData;
}

export function EmploymentMetricsCard({ marketData }: EmploymentMetricsCardProps) {
  // Add console logs for debugging employment data
  console.log('Employment Data:', {
    private_sector: marketData.private_sector_accountants,
    public_sector: marketData.public_sector_accountants
  });

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Users className="w-5 h-5 mr-2" />
          Employment Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-white/60">Private Sector Accountants</span>
            <span className="text-white font-medium">
              {marketData.private_sector_accountants?.toLocaleString() || 'N/A'}
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm text-white/60">Public Sector Accountants</span>
            <span className="text-white font-medium">
              {marketData.public_sector_accountants?.toLocaleString() || 'N/A'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}