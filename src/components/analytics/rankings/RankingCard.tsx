import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp, Users, Building2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStateName } from "@/utils/stateUtils";

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
  specialization?: string;
}

export const RankingCard = ({
  title,
  region,
  firmCount,
  densityRank,
  growthRank,
  comparedToNational,
  specialization
}: RankingCardProps) => {
  const [displayName, setDisplayName] = useState(region);
  const isDensityHigher = comparedToNational.density > 1;
  const isGrowthHigher = comparedToNational.growth > 1;

  useEffect(() => {
    const fetchStateName = async () => {
      const name = await getStateName(region);
      setDisplayName(name);
    };
    fetchStateName();
  }, [region]);

  return (
    <Card className="p-4 bg-black/40 backdrop-blur-md border-white/10 hover:bg-black/50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{displayName}</p>
        </div>
        <Trophy className="w-6 h-6 text-yellow-400" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Building2 className="w-4 h-4" />
            <span>Firms</span>
          </div>
          <p className="text-lg font-semibold text-white">{firmCount.toLocaleString()}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>Density Rank</span>
          </div>
          <p className="text-lg font-semibold text-white">#{densityRank}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Density vs National</span>
          <div className={cn(
            "flex items-center gap-1 text-sm",
            isDensityHigher ? "text-green-400" : "text-red-400"
          )}>
            {isDensityHigher ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs((comparedToNational.density - 1) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Growth vs National</span>
          <div className={cn(
            "flex items-center gap-1 text-sm",
            isGrowthHigher ? "text-green-400" : "text-red-400"
          )}>
            {isGrowthHigher ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs((comparedToNational.growth - 1) * 100).toFixed(1)}%
          </div>
        </div>

        {specialization && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Specialization</span>
            <span className="text-sm text-blue-400">{specialization}</span>
          </div>
        )}
      </div>
    </Card>
  );
};