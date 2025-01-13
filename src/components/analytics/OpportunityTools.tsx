import { Search, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function OpportunityTools() {
  const { data: topFirms } = useQuery({
    queryKey: ['topFirms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select('*')
        .order('employeeCount', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Top Opportunities</h3>
        </div>
      </div>

      <div className="space-y-4">
        {topFirms?.map((firm, index) => (
          <div key={firm["Company ID"]} className="bg-white/5 p-4 rounded">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">{firm["Company Name"]}</div>
                <div className="text-xs text-white/60">{firm["State Name"]}</div>
              </div>
              <div className="text-sm text-yellow-400">
                {firm.employeeCount} employees
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}