import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  Building2, 
  BarChart3, 
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import type { EnhancedMarketScore, MarketTrend, CompetitiveAnalysis } from "@/types/analytics";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function EnhancedAnalytics() {
  const { data: marketScores } = useQuery<EnhancedMarketScore[]>({
    queryKey: ['enhancedMarketScores'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_enhanced_market_scores');
      if (error) throw error;
      return data;
    }
  });

  const { data: marketTrends } = useQuery<MarketTrend[]>({
    queryKey: ['marketTrends'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_market_trends');
      if (error) throw error;
      return data;
    }
  });

  const { data: competitiveAnalysis } = useQuery<CompetitiveAnalysis[]>({
    queryKey: ['competitiveAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_competitive_analysis');
      if (error) throw error;
      return data;
    }
  });

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'Increasing':
        return <ArrowUpRight className="w-4 h-4 text-green-400" />;
      case 'Decreasing':
        return <ArrowDownRight className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Scores Section */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Enhanced Market Scores</h3>
          <p className="text-sm text-white/60 mb-4">
            Comprehensive market analysis based on multiple factors
          </p>
          
          <div className="grid gap-4">
            {marketScores?.slice(0, 5).map((score, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium">State {score.STATEFP}</div>
                  <div className="text-sm text-white/60">
                    Total Score: {Math.round(score.total_score * 100)}%
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex flex-col items-center">
                          <Users className="w-4 h-4 text-blue-400 mb-1" />
                          <div className="text-xs text-white/60">
                            {Math.round(score.population_score * 100)}%
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Population Score</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex flex-col items-center">
                          <BarChart3 className="w-4 h-4 text-green-400 mb-1" />
                          <div className="text-xs text-white/60">
                            {Math.round(score.economic_score * 100)}%
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Economic Score</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex flex-col items-center">
                          <Building2 className="w-4 h-4 text-yellow-400 mb-1" />
                          <div className="text-xs text-white/60">
                            {Math.round(score.business_density_score * 100)}%
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Business Density Score</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex flex-col items-center">
                          <Users className="w-4 h-4 text-purple-400 mb-1" />
                          <div className="text-xs text-white/60">
                            {Math.round(score.employment_score * 100)}%
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Employment Score</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex flex-col items-center">
                          <TrendingUp className="w-4 h-4 text-pink-400 mb-1" />
                          <div className="text-xs text-white/60">
                            {Math.round(score.market_potential_score * 100)}%
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Market Potential Score</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Market Trends Section */}
      <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-white/10">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Market Trends</h3>
          <p className="text-sm text-white/60 mb-4">
            Historical movement patterns and growth rates
          </p>
          
          <div className="grid gap-4">
            {marketTrends?.slice(0, 5).map((trend, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium">State {trend.STATEFP}</div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(trend.trend_direction)}
                    <span className="text-sm text-white/60">
                      {trend.growth_rate > 0 ? '+' : ''}{Math.round(trend.growth_rate)}% Growth
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="text-center">
                    <div className="text-sm text-white/60">2020</div>
                    <div className="text-white font-medium">{trend.year_2020_moves.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-white/60">2021</div>
                    <div className="text-white font-medium">{trend.year_2021_moves.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-white/60">2022</div>
                    <div className="text-white font-medium">{trend.year_2022_moves.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Competitive Analysis Section */}
      <Card className="bg-gradient-to-br from-yellow-500/10 to-red-500/10 border-white/10">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Competitive Analysis</h3>
          <p className="text-sm text-white/60 mb-4">
            Market saturation and competition levels
          </p>
          
          <div className="grid gap-4">
            {competitiveAnalysis?.slice(0, 5).map((analysis, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium">State {analysis.STATEFP}</div>
                  <div className="text-sm text-white/60">
                    {analysis.competition_level} Competition
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-white/60">Total Firms</div>
                    <div className="text-white font-medium">{analysis.total_firms.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-white/60">Avg Employees</div>
                    <div className="text-white font-medium">{Math.round(analysis.avg_employee_count)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-white/60">Market Density</div>
                    <div className="text-white font-medium">
                      {analysis.market_concentration.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}