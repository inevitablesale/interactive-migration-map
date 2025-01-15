import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Building2, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MarketMetric {
  id: number;
  title: string;
  value: string;
  change: number;
  icon: typeof Building2 | typeof Users | typeof TrendingUp;
  details?: {
    label: string;
    value: string;
  }[];
}

interface StatePerformance {
  state: string;
  rank: number;
  score: number;
  metrics: {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
  }[];
}

export function KeyInsightsPanel() {
  const [selectedMetric, setSelectedMetric] = useState<MarketMetric | null>(null);
  const navigate = useNavigate();

  const { data: marketOpportunities } = useQuery({
    queryKey: ['marketMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_market_opportunities');
      if (error) throw error;

      // Transform the data to match MarketMetric interface
      const transformedData: MarketMetric[] = [
        {
          id: 1,
          title: "Market Growth",
          value: `${data[0]?.migration_score.toFixed(1)}%`,
          change: data[0]?.migration_score || 0,
          icon: TrendingUp,
          details: [
            { label: "Migration Score", value: `${data[0]?.migration_score.toFixed(1)}%` },
            { label: "Business Density", value: `${data[0]?.business_density_score.toFixed(1)}` }
          ]
        },
        {
          id: 2,
          title: "Service Coverage",
          value: `${data[0]?.service_coverage_score.toFixed(1)}%`,
          change: data[0]?.service_coverage_score || 0,
          icon: Building2,
          details: [
            { label: "Coverage Score", value: `${data[0]?.service_coverage_score.toFixed(1)}%` }
          ]
        }
      ];

      return transformedData;
    }
  });

  const { data: stateRankings } = useQuery({
    queryKey: ['statePerformance'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_state_rankings');
      if (error) throw error;

      // Transform the data to match StatePerformance interface
      const transformedData: StatePerformance[] = data.map(state => ({
        state: state.statefp,
        rank: state.density_rank,
        score: state.total_firms,
        metrics: [
          {
            label: "Firm Density",
            value: state.firm_density.toFixed(1),
            trend: state.growth_rate > 0 ? 'up' : state.growth_rate < 0 ? 'down' : 'neutral'
          },
          {
            label: "Growth Rate",
            value: `${state.growth_rate.toFixed(1)}%`,
            trend: state.growth_rate > 0 ? 'up' : state.growth_rate < 0 ? 'down' : 'neutral'
          },
          {
            label: "Market Saturation",
            value: state.market_saturation.toFixed(1),
            trend: 'neutral'
          }
        ]
      }));

      return transformedData;
    }
  });

  useEffect(() => {
    if (!marketOpportunities || !stateRankings) return;
    // Additional initialization logic if needed
  }, [marketOpportunities, stateRankings]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Market Insights at a Glance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketOpportunities?.map((metric) => (
          <Card
            key={metric.id}
            className="p-6 cursor-pointer hover:bg-gray-50/5 transition-colors"
            onClick={() => setSelectedMetric(metric)}
          >
            <div className="flex items-center justify-between mb-4">
              <metric.icon className="w-5 h-5 text-blue-500" />
              <span className={`text-sm ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>
            </div>
            <h3 className="text-lg font-medium text-gray-200 mb-2">{metric.title}</h3>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">State Performance Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stateRankings?.map((state) => (
            <Card key={state.state} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-200">{state.state}</h3>
                <span className="text-sm text-gray-400">Rank #{state.rank}</span>
              </div>
              <div className="space-y-4">
                {state.metrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white">{metric.value}</span>
                      <ArrowUpRight
                        className={`w-4 h-4 ${
                          metric.trend === 'up'
                            ? 'text-green-500'
                            : metric.trend === 'down'
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className="w-full mt-4"
                variant="outline"
                onClick={() => navigate(`/market-report/${state.state}`)}
              >
                View Full Report
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedMetric} onOpenChange={() => setSelectedMetric(null)}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">{selectedMetric?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {selectedMetric?.details?.map((detail, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-400">{detail.label}</span>
                <span className="text-white font-medium">{detail.value}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}