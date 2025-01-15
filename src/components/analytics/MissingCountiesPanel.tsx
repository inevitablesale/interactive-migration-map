import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface MissingCounty {
  COUNTYNAME: string;
  state: string;
  total_missing: number;
}

export function MissingCountiesPanel() {
  const { data: missingCounties, isLoading } = useQuery({
    queryKey: ['missingCounties'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_missing_counties');
      if (error) throw error;
      return data as MissingCounty[];
    },
  });

  if (isLoading) {
    return <div>Loading missing counties data...</div>;
  }

  if (!missingCounties?.length) {
    return null;
  }

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-yellow-400" />
        <h2 className="text-lg font-semibold text-white">Missing Counties Analysis</h2>
      </div>
      <div className="text-sm text-white/80 mb-4">
        Found {missingCounties[0]?.total_missing} counties missing from rankings
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(
          missingCounties.reduce((acc, county) => {
            if (!acc[county.state]) {
              acc[county.state] = [];
            }
            acc[county.state].push(county.COUNTYNAME);
            return acc;
          }, {} as Record<string, string[]>)
        ).map(([state, counties]) => (
          <div key={state} className="bg-black/40 rounded-lg p-4">
            <h3 className="font-medium text-white mb-2">{state}</h3>
            <ul className="space-y-1">
              {counties.map((county) => (
                <li key={county} className="text-sm text-gray-400">
                  {county}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}