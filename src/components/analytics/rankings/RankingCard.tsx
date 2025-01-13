import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp, Users, Building2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  specialization?: string;
}

export const RankingCard = ({
  title,
  region,
  firmCount,
  densityRank,
  growthRank,
  comparedToNational,
  marketSaturation,
  specialization
}: RankingCardProps) => {
  const isDensityHigher = comparedToNational.density > 1;
  const isGrowthHigher = comparedToNational.growth > 1;

  return (
    <Card className="p-4 bg-black/40 backdrop-blur-md border-white/10 hover:bg-black/50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{region}</p>
        </div>
        <Trophy className="w-6 h-6 text-yellow-400" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">Total Firms</span>
          </div>
          <p className="text-xl font-semibold text-white">{firmCount.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-gray-400">Density Rank:</span>
            <span className="text-white">#{densityRank}</span>
            {isDensityHigher ? (
              <ArrowUpRight className="w-3 h-3 text-green-400" />
            ) : (
              <ArrowDownRight className="w-3 h-3 text-red-400" />
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-300">Growth Metrics</span>
          </div>
          <p className="text-xl font-semibold text-white">#{growthRank}</p>
          <div className="flex items-center gap-1 text-xs">
            <span className={cn(
              "px-1.5 py-0.5 rounded",
              isGrowthHigher ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
            )}>
              {((comparedToNational.growth - 1) * 100).toFixed(1)}% vs natl.
            </span>
          </div>
        </div>
      </div>

      {(marketSaturation || specialization) && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            {marketSaturation && (
              <div>
                <span className="text-gray-400">Market Saturation:</span>
                <span className="ml-2 text-white">{(marketSaturation * 100).toFixed(1)}%</span>
              </div>
            )}
            {specialization && (
              <div>
                <span className="text-gray-400">Specialization:</span>
                <span className="ml-2 text-white">{specialization}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};