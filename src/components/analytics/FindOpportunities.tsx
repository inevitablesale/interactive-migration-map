import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  Building2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  Target,
  BarChart3,
  MapPin,
  TrendingDown,
  Building,
  ChevronRight
} from "lucide-react";
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
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'Decreasing':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Market Opportunities</h2>
          <p className="text-gray-400">Discover high-potential markets based on our comprehensive analysis</p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Target className="w-4 h-4 mr-2" />
          Set Target Criteria
        </Button>
      </div>

      {/* Top Markets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities?.slice(0, 6).map((market, index) => (
          <Card key={index} className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10 p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-lg font-semibold text-white">{market.countyname}</div>
                <div className="text-sm text-gray-400">State {market.statefp}</div>
              </div>
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">Migration Score</div>
                <div className="text-white font-medium">{Math.round(market.migration_score)}%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">Business Density</div>
                <div className="text-white font-medium">{Math.round(market.business_density_score)}%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">Service Coverage</div>
                <div className="text-white font-medium">{Math.round(market.service_coverage_score)}%</div>
              </div>
            </div>

            <Button variant="ghost" className="w-full mt-4 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20">
              View Details <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        ))}
      </div>

      {/* Market Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Competition Analysis */}
        <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Market Competition</h3>
              <p className="text-sm text-gray-400">Analysis of market saturation levels</p>
            </div>
            <BarChart3 className="w-5 h-5 text-green-400" />
          </div>

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
                <Bar dataKey="total_firms" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Market Trends */}
        <Card className="bg-gradient-to-br from-yellow-500/10 to-red-500/10 border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Market Trends</h3>
              <p className="text-sm text-gray-400">Historical movement patterns</p>
            </div>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>

          <div className="space-y-4">
            {marketTrends?.slice(0, 5).map((trend, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white font-medium">State {trend.statefp}</div>
                  <div className="flex items-center gap-2 text-sm">
                    {getTrendIcon(trend.trend_direction)}
                    <span className={`${
                      trend.growth_rate > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trend.growth_rate > 0 ? '+' : ''}{Math.round(trend.growth_rate)}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">2020</div>
                    <div className="text-sm text-white font-medium">
                      {trend.year_2020_moves.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">2021</div>
                    <div className="text-sm text-white font-medium">
                      {trend.year_2021_moves.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">2022</div>
                    <div className="text-sm text-white font-medium">
                      {trend.year_2022_moves.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}