import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MarketData {
  county_name: string;
  state: string;
  population_growth: number;
  growth_rate_percentage: number;
  total_movedin_2022: number;
  total_movedin_2021: number;
  total_movedin_2020: number;
  total_moves: number;
}

export default function MarketReport() {
  const { county, state } = useParams();
  const navigate = useNavigate();

  const { data: marketData, isLoading } = useQuery({
    queryKey: ['marketData', county, state],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_market_growth_metrics');
      if (error) throw error;
      return (data as MarketData[]).find(
        (item) => item.county_name === county && item.state === state
      );
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#222222] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">Loading market data...</div>
        </div>
      </div>
    );
  }

  if (!marketData) {
    return (
      <div className="min-h-screen bg-[#222222] p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Market not found</h1>
          <Button onClick={() => navigate(-1)} variant="outline" className="text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analysis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222222] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button onClick={() => navigate(-1)} variant="outline" className="text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analysis
          </Button>
          <h1 className="text-4xl font-bold text-white">
            {marketData.county_name}, {marketData.state}
          </h1>
          <p className="text-gray-400 mt-2">Market Growth Analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Growth Metrics</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Growth Rate</p>
                <p className="text-2xl font-bold text-green-400">
                  +{marketData.growth_rate_percentage.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-gray-400">Total Population Movement</p>
                <p className="text-2xl font-bold text-white">
                  {marketData.total_moves.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Movement Trends</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">2022 Move-ins</p>
                <p className="text-xl font-bold text-white">
                  {marketData.total_movedin_2022.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400">2021 Move-ins</p>
                <p className="text-xl font-bold text-white">
                  {marketData.total_movedin_2021.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400">2020 Move-ins</p>
                <p className="text-xl font-bold text-white">
                  {marketData.total_movedin_2020.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}