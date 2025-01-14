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
      (marketData.density_rank || 0) * 0.3
    );
    if (score <= 20) return { label: "Top Market", color: "bg-emerald-500" };
    if (score <= 50) return { label: "Strong Market", color: "bg-blue-500" };
    return { label: "Developing Market", color: "bg-yellow-500" };
  };

  const calculateTalentPool = () => {
    const score = marketData.total_education_population && marketData.bachelors_degree_holders
      ? (marketData.bachelors_degree_holders / marketData.total_education_population) * 100
      : 0;
    if (score > 35) return { label: "Deep Talent Pool", color: "bg-emerald-500" };
    if (score > 25) return { label: "Growing Talent", color: "bg-blue-500" };
    return { label: "Emerging Talent", color: "bg-yellow-500" };
  };

  const calculateGrowthPotential = () => {
    const score = marketData.growth_rate_percentage || 0;
    if (score > 5) return { label: "High Growth Potential", color: "bg-emerald-500" };
    if (score > 2) return { label: "Moderate Growth", color: "bg-blue-500" };
    return { label: "Stable Market", color: "bg-yellow-500" };
  };

  const marketStrength = calculateMarketStrength();
  const talentPool = calculateTalentPool();
  const growthPotential = calculateGrowthPotential();

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge className={marketStrength.color}>{marketStrength.label}</Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Based on income levels, growth trends, and business density</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <Badge className={talentPool.color}>{talentPool.label}</Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Based on education levels and professional workforce</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <Badge className={growthPotential.color}>{growthPotential.label}</Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Based on population growth and business formation rates</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};