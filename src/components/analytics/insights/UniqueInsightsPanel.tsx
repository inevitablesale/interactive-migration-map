import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Building2 } from "lucide-react";

export function UniqueInsightsPanel() {
  const { data: insights } = useQuery({
    queryKey: ['uniqueInsights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select('*')
        .order('followerCount', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Unlock Hidden Patterns</h3>
      
      <div className="space-y-6">
        {/* Follower Count Anomalies */}
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-blue-400" />
            <h4 className="font-medium text-white">Follower Count Anomalies</h4>
          </div>
          <div className="space-y-2">
            {insights?.map((firm) => (
              <div key={firm["Company ID"]} className="flex items-center justify-between">
                <span className="text-sm text-white/60">{firm["Company Name"]}</span>
                <span className="text-sm text-white">{firm.followerCount} followers</span>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Growth Challenges */}
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <h4 className="font-medium text-white">Employee Growth Challenges</h4>
          </div>
          <div className="space-y-2">
            {insights?.map((firm) => (
              <div key={firm["Company ID"]} className="flex items-center justify-between">
                <span className="text-sm text-white/60">{firm["Company Name"]}</span>
                <span className="text-sm text-white">{firm.employeeCount} employees</span>
              </div>
            ))}
          </div>
        </div>

        {/* Economic Resilience */}
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-green-400" />
            <h4 className="font-medium text-white">Economic Resilience</h4>
          </div>
          <div className="space-y-2">
            {insights?.map((firm) => (
              <div key={firm["Company ID"]} className="flex items-center justify-between">
                <span className="text-sm text-white/60">{firm["State Name"]}</span>
                <span className="text-sm text-white">High Stability</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}