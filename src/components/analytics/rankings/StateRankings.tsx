import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StateRanking } from "@/types/rankings";
import { RankingCard } from "./RankingCard";
import { Skeleton } from "@/components/ui/skeleton";

export const StateRankings = () => {
  const { data: rankings, isLoading } = useQuery({
    queryKey: ['stateRankings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_state_rankings');
      
      if (error) throw error;
      return data as StateRanking[];
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] bg-white/5" />
        ))}
      </div>
    );
  }

  if (!rankings) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {rankings.slice(0, 6).map((ranking) => (
        <RankingCard
          key={ranking.statefp}
          title="State Ranking"
          region={`State ${ranking.statefp}`}
          firmCount={ranking.total_firms}
          densityRank={ranking.density_rank}
          growthRank={ranking.growth_rank}
          comparedToNational={{
            density: ranking.firm_density / ranking.national_density_avg,
            growth: ranking.growth_rate / ranking.national_growth_avg,
          }}
          marketSaturation={ranking.market_saturation}
        />
      ))}
    </div>
  );
};