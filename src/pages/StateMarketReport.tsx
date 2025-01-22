import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export default function StateMarketReport() {
  const { data: stateRankings, isLoading } = useQuery({
    queryKey: ['state-rankings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_rankings')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">State Market Report</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stateRankings?.map((state) => (
          <Card key={state.statefp} className="p-4">
            <h3 className="font-semibold">{state.statefp}</h3>
            <p>Total Firms: {state.total_firms}</p>
            <p>Density Rank: {state.density_rank}</p>
            <p>Growth Rate: {(state.growth_rate * 100).toFixed(2)}%</p>
          </Card>
        ))}
      </div>
    </div>
  );
}