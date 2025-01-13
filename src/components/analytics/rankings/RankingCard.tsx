import { Card } from "@/components/ui/card";
import { Building2, TrendingUp, Users, DollarSign, GraduationCap } from "lucide-react";

interface RankingCardProps {
  title: string;
  region: string;
  firmCount: number;
  densityRank: number;
  growthRank: number;
  comparedToNational: {
    density: number;
    growth: number;
  };
  marketSaturation?: number;
  avgPayrollPerFirm?: number;
  educationRate?: number;
}

export const RankingCard = ({
  title,
  region,
  firmCount,
  densityRank,
  growthRank,
  comparedToNational,
  marketSaturation,
  avgPayrollPerFirm,
  educationRate
}: RankingCardProps) => {
  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm text-white/60">{title}</h3>
            <p className="text-lg font-semibold text-white">{region}</p>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white">{firmCount.toLocaleString()} firms</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/60">Density Rank</span>
            </div>
            <p className="text-lg font-semibold text-white">#{densityRank}</p>
            <p className="text-sm text-white/60">
              {(comparedToNational.density * 100).toFixed(1)}% of national avg
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-white/60">Growth Rank</span>
            </div>
            <p className="text-lg font-semibold text-white">#{growthRank}</p>
            <p className="text-sm text-white/60">
              {(comparedToNational.growth * 100).toFixed(1)}% of national avg
            </p>
          </div>
        </div>

        {(marketSaturation !== undefined || avgPayrollPerFirm !== undefined || educationRate !== undefined) && (
          <div className="grid grid-cols-3 gap-4">
            {marketSaturation !== undefined && (
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-white/60">Market Saturation</span>
                </div>
                <p className="text-lg font-semibold text-white">
                  {marketSaturation.toFixed(1)}%
                </p>
              </div>
            )}

            {avgPayrollPerFirm !== undefined && (
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white/60">Avg Payroll</span>
                </div>
                <p className="text-lg font-semibold text-white">
                  ${(avgPayrollPerFirm / 1000).toFixed(0)}k
                </p>
              </div>
            )}

            {educationRate !== undefined && (
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap className="w-4 h-4 text-pink-400" />
                  <span className="text-sm text-white/60">Education</span>
                </div>
                <p className="text-lg font-semibold text-white">
                  {educationRate.toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};