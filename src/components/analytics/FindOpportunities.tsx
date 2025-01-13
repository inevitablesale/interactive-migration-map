import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Building2, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { MarketOpportunityScore, CompetitiveAnalysis, MarketTrend } from "@/types/analytics";
import { TargetCriteriaForm } from "./TargetCriteriaForm";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export function FindOpportunities() {
  const { data: opportunities } = useQuery<MarketOpportunityScore[]>({
    queryKey: ['marketOpportunities'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_market_opportunities');
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

  const { data: marketTrends } = useQuery<MarketTrend[]>({
    queryKey: ['marketTrends'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_market_trends');
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
      {/* Target Criteria Form */}
      <Card className="bg-black/40 border-white/10">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Target Criteria</h3>
          <TargetCriteriaForm onAnalyze={() => {}} isAnalyzing={false} />
        </div>
      </Card>

      {/* Market Opportunities */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Top Market Opportunities</h3>
          <p className="text-sm text-white/60 mb-4">
            Markets with high growth potential based on migration, business density, and service coverage
          </p>
          
          <div className="grid gap-4">
            {opportunities?.map((market, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-medium">{market.countyname}</h4>
                    <p className="text-sm text-white/60">
                      Opportunity Score: {Math.round((market.migration_score + market.business_density_score + market.service_coverage_score) / 3)}
                    </p>
                  </div>
                  <Button className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                    Explore
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <div className="text-sm">
                      <div className="text-white/60">Migration</div>
                      <div className="text-white font-medium">{Math.round(market.migration_score)}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-yellow-400" />
                    <div className="text-sm">
                      <div className="text-white/60">Density</div>
                      <div className="text-white font-medium">{Math.round(market.business_density_score)}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <div className="text-sm">
                      <div className="text-white/60">Coverage</div>
                      <div className="text-white font-medium">{Math.round(market.service_coverage_score)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Competitive Analysis */}
      <Card className="bg-gradient-to-br from-yellow-500/10 to-red-500/10 border-white/10">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Market Competition</h3>
          <p className="text-sm text-white/60 mb-4">
            Analysis of market saturation and competition levels
          </p>

          <div className="h-[300px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competitiveAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="statefp" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="total_firms" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4">
            {competitiveAnalysis?.slice(0, 5).map((analysis, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium">State {analysis.statefp}</div>
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

      {/* Market Trends */}
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
                  <div className="text-white font-medium">State {trend.statefp}</div>
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
    </div>
  );
}