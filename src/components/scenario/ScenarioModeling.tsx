import React from 'react';
import { Card } from "@/components/ui/card";
import { MarketOpportunityMap } from './MarketOpportunityMap';
import { ValuationEstimator } from './ValuationEstimator';
import { BuyerStrategyOptimizer } from './BuyerStrategyOptimizer';

export function ScenarioModeling() {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-6">Market Opportunity Analysis</h2>
        <MarketOpportunityMap />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ValuationEstimator />
        <BuyerStrategyOptimizer />
      </div>
    </div>
  );
}