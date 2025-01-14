import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, TrendingUp, DollarSign } from "lucide-react";

export function RegionalHighlights() {
  const { data: msaRankings } = useQuery({
    queryKey: ['msaRankings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_msa_rankings');
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Regional Highlights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <div className="text-sm font-medium text-white">Top MSAs</div>
          </div>
          <div className="space-y-2">
            {msaRankings?.slice(0, 3).map((msa, index) => (
              <div key={index} className="text-sm text-white/60">
                {msa.msa_name}: {Math.round(msa.growth_rate)}% growth
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <div className="text-sm font-medium text-white">Growth Leaders</div>
          </div>
          <div className="space-y-2">
            {msaRankings?.slice(0, 3).map((msa, index) => (
              <div key={index} className="text-sm text-white/60">
                {msa.msa_name}: {Math.round(msa.firm_density)} firms/10k people
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-yellow-400" />
            <div className="text-sm font-medium text-white">Economic Leaders</div>
          </div>
          <div className="space-y-2">
            {msaRankings?.slice(0, 3).map((msa, index) => (
              <div key={index} className="text-sm text-white/60">
                {msa.msa_name}: ${Math.round(msa.avg_payroll_per_firm / 1000)}k/firm
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}