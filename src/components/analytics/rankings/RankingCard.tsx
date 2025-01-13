import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp, Users } from "lucide-react";

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
}

export const RankingCard = ({
  title,
  region,
  firmCount,
  densityRank,
  growthRank,
  comparedToNational,
}: RankingCardProps) => {
  return (
    <Card className="p-4 bg-black/40 backdrop-blur-md border-white/10">
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
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">Total Firms</span>
          </div>
          <p className="text-xl font-semibold text-white">{firmCount.toLocaleString()}</p>
          <p className="text-xs text-gray-400">
            Density Rank: #{densityRank}
            <span className="ml-2">
              ({(comparedToNational.density * 100).toFixed(1)}% vs national avg)
            </span>
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-300">Growth Rank</span>
          </div>
          <p className="text-xl font-semibold text-white">#{growthRank}</p>
          <p className="text-xs text-gray-400">
            {(comparedToNational.growth * 100).toFixed(1)}% vs national avg
          </p>
        </div>
      </div>
    </Card>
  );
};