import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, 
  Building2, 
  DollarSign, 
  Users, 
  BarChart3,
  Scale
} from "lucide-react";
import type { MarketSimilarityAnalysis } from "@/types/market-analysis";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface AnalysisFilters {
  employeeCountMin: string;
  employeeCountMax: string;
  revenueMin: string;
  revenueMax: string;
  region: string;
}

interface Props {
  filters: AnalysisFilters;
}

export function MarketSimilarityAnalysis({ filters }: Props) {
  const { data: marketAnalysis, error } = useQuery<MarketSimilarityAnalysis[]>({
    queryKey: ['marketSimilarityAnalysis', filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_market_similarity_analysis', {
        p_employee_min: filters.employeeCountMin ? parseInt(filters.employeeCountMin) : null,
        p_employee_max: filters.employeeCountMax ? parseInt(filters.employeeCountMax) : null,
        p_revenue_min: filters.revenueMin ? parseInt(filters.revenueMin.replace(/\D/g, '')) : null,
        p_revenue_max: filters.revenueMax ? parseInt(filters.revenueMax.replace(/\D/g, '')) : null,
        p_region: filters.region === 'all' ? null : filters.region
      });

      if (error) {
        console.error('Error fetching market similarity analysis:', error);
        toast.error('Failed to load market analysis data');
        throw error;
      }
      
      return (data || []).map(item => ({
        ...item,
        key_factors: {
          median_income: Number((item.key_factors as any).median_income),
          labor_force: Number((item.key_factors as any).labor_force),
          property_value: Number((item.key_factors as any).property_value),
          market_saturation: Number((item.key_factors as any).market_saturation),
          deal_velocity: Number((item.key_factors as any).deal_velocity)
        }
      }));
    },
    retry: 1
  });

  if (error) {
    console.error('Query error:', error);
    return null;
  }

  if (!marketAnalysis?.length) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Market Pattern Analysis</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Scale className="w-5 h-5 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">Analysis based on historical deals and current market conditions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {marketAnalysis.slice(0, 4).map((analysis, index) => (
          <Card key={index} className="p-6 bg-black/40 backdrop-blur-md border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{analysis.region_name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">Similarity Score</span>
                <span className="text-lg font-bold text-yellow-400">{analysis.similarity_score}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white/60">Active Firms</span>
                </div>
                <p className="text-xl font-semibold text-white">{analysis.active_firms_count.toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white/60">Avg Deal Size</span>
                </div>
                <p className="text-xl font-semibold text-white">${analysis.avg_deal_size.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white/60">Success Rate</span>
                </div>
                <span className="text-sm font-medium text-white">{analysis.projected_success_rate}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-white/60">Market Density</span>
                </div>
                <span className="text-sm font-medium text-white">{analysis.market_density.toFixed(2)} per 100k</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white/60">Opportunities</span>
                </div>
                <span className="text-sm font-medium text-white">{analysis.potential_opportunities.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="text-sm font-medium text-white/80 mb-3">Key Market Factors</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/60">Median Income</p>
                  <p className="text-white font-medium">${analysis.key_factors.median_income.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-white/60">Deal Velocity</p>
                  <p className="text-white font-medium">{(analysis.key_factors.deal_velocity * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}