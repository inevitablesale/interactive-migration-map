import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import type { ComprehensiveMarketData } from "@/types/rankings";

interface EducationDistributionCardProps {
  marketData: ComprehensiveMarketData;
}

export function EducationDistributionCard({ marketData }: EducationDistributionCardProps) {
  const calculatePercentage = (value: number | undefined | null, total: number | undefined | null) => {
    if (!value || !total || total === 0) return 0;
    return (value / total) * 100;
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <GraduationCap className="w-5 h-5 mr-2" />
          Education Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-white/60">Bachelor's Degree</span>
            <span className="text-white font-medium">
              {calculatePercentage(
                marketData.bachelors_degree_holders,
                marketData.total_education_population
              ).toFixed(1)}%
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm text-white/60">Master's Degree</span>
            <span className="text-white font-medium">
              {calculatePercentage(
                marketData.masters_degree_holders,
                marketData.total_education_population
              ).toFixed(1)}%
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm text-white/60">Doctorate Degree</span>
            <span className="text-white font-medium">
              {calculatePercentage(
                marketData.doctorate_degree_holders,
                marketData.total_education_population
              ).toFixed(1)}%
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm text-white/60">Total Population</span>
            <span className="text-white font-medium">
              {marketData.total_education_population?.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}