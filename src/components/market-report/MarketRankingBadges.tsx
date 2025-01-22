import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ComprehensiveMarketData } from '@/types/rankings';

interface MarketRankingBadgesProps {
  marketData: ComprehensiveMarketData;
}

export const MarketRankingBadges: React.FC<MarketRankingBadgesProps> = ({ marketData }) => {
  const calculateMarketStrength = () => {
    const score = (
      (marketData.income_rank || 0) * 0.3 +
      (marketData.growth_rank || 0) * 0.4 +
      (marketData.population_rank || 0) * 0.3
    );
    if (score <= 20) return { label: "Top Market", color: "bg-emerald-500/90 hover:bg-emerald-500/80" };
    if (score <= 50) return { label: "Strong Market", color: "bg-blue-500/90 hover:bg-blue-500/80" };
    return { label: "Developing Market", color: "bg-amber-500/90 hover:bg-amber-500/80" };
  };

  const calculateTalentPool = () => {
    const score = marketData.total_education_population && marketData.bachelors_holders
      ? (marketData.bachelors_holders / marketData.total_education_population) * 100
      : 0;
    if (score > 35) return { label: "Deep Talent Pool", color: "bg-emerald-500/90 hover:bg-emerald-500/80" };
    if (score > 25) return { label: "Growing Talent", color: "bg-blue-500/90 hover:bg-blue-500/80" };
    return { label: "Emerging Talent", color: "bg-amber-500/90 hover:bg-amber-500/80" };
  };

  const calculateGrowthPotential = () => {
    const score = marketData.population_growth_rate || 0;
    if (score > 5) return { label: "High Growth Potential", color: "bg-emerald-500/90 hover:bg-emerald-500/80" };
    if (score > 2) return { label: "Moderate Growth", color: "bg-blue-500/90 hover:bg-blue-500/80" };
    return { label: "Stable Market", color: "bg-amber-500/90 hover:bg-amber-500/80" };
  };

  const marketStrength = calculateMarketStrength();
  const talentPool = calculateTalentPool();
  const growthPotential = calculateGrowthPotential();

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge className={`${marketStrength.color} text-white font-medium px-3 py-1`}>
              {marketStrength.label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Based on income levels, growth trends, and population</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <Badge className={`${talentPool.color} text-white font-medium px-3 py-1`}>
              {talentPool.label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Based on education levels and professional workforce</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <Badge className={`${growthPotential.color} text-white font-medium px-3 py-1`}>
              {growthPotential.label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Based on population growth and business formation rates</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};