import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ComparablesPanel } from "@/components/analytics/ComparablesPanel";
import { MarketOpportunityInsights } from "@/components/analytics/insights/MarketOpportunityInsights";
import { ScenarioModeling } from "@/components/comparison/ScenarioModeling";

export default function Analysis() {
  const [scenarioData, setScenarioData] = useState<any[]>([]);

  const { data: stateData } = useQuery({
    queryKey: ['stateData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_data')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: statesList } = useQuery({
    queryKey: ['statesList'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_fips_codes')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ComparablesPanel />
          <MarketOpportunityInsights />
        </div>
        <div className="space-y-6">
          <ScenarioModeling 
            stateData={stateData || []}
            statesList={statesList || []}
            onUpdateScenario={setScenarioData}
          />
        </div>
      </div>
    </div>
  );
}