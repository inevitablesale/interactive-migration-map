import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MSARanking } from "@/types/rankings";
import { RankingCard } from "./RankingCard";

export const MSARankings = () => {
  const { data: rankings } = useQuery({
    queryKey: ['msaRankings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_msa_rankings');
      
      if (error) throw error;
      return data as MSARanking[];
    }
  });

  if (!rankings) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">MSA Rankings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rankings.slice(0, 6).map((ranking) => (
          <RankingCard
            key={ranking.msa}
            title="MSA Ranking"
            region={ranking.msa_name}
            firmCount={ranking.total_firms}
            densityRank={ranking.density_rank}
            growthRank={ranking.growth_rank}
            comparedToNational={{
              density: ranking.firm_density / ranking.national_density_avg,
              growth: ranking.growth_rate / ranking.national_growth_avg,
            }}
          />
        ))}
      </div>
    </div>
  );
};