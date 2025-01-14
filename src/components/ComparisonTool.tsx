import { useState } from "react";
import { Building2, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StateMetrics {
  STATEFP: string;
  firm_density: number | null;
  growth_rate: number | null;
}

interface StateData extends Partial<StateMetrics> {
  state_name?: string;
}

const fetchStateData = async (stateFp: string): Promise<StateData> => {
  // Fetch state name
  const { data: stateData, error: stateError } = await supabase
    .from('state_fips_codes')
    .select('state')
    .eq('fips_code', stateFp)
    .single();

  if (stateError) throw stateError;

  // Fetch market trends for growth rate
  const { data: trendsData, error: trendsError } = await supabase
    .rpc('get_market_trends')
    .eq('statefp', stateFp)
    .single();

  if (trendsError) throw trendsError;

  // Fetch state data for firm density calculation
  const { data: metricsData, error: metricsError } = await supabase
    .from('state_data')
    .select('STATEFP, B23025_004E, ESTAB')
    .eq('STATEFP', stateFp)
    .single();

  if (metricsError) throw metricsError;

  // Calculate firm density
  const firmDensity = metricsData.ESTAB && metricsData.B23025_004E ? 
    (metricsData.ESTAB / metricsData.B23025_004E) * 100 : null;

  return {
    state_name: stateData.state,
    firm_density: firmDensity,
    growth_rate: trendsData?.growth_rate || null,
  };
};

const formatNumber = (value: number | null, decimals: number = 2) => {
  if (value === null) return 'N/A';
  return value.toFixed(decimals);
};

export function ComparisonTool() {
  const [selectedStates, setSelectedStates] = useState<StateData[]>([]);
  const { toast } = useToast();

  const handleAddState = async (stateFp: string) => {
    try {
      if (selectedStates.length >= 3) {
        toast({
          title: "Maximum states reached",
          description: "You can only compare up to 3 states at a time",
          variant: "destructive",
        });
        return;
      }

      const stateData = await fetchStateData(stateFp);
      setSelectedStates(prev => [...prev, stateData]);
    } catch (error) {
      console.error('Error adding state:', error);
      toast({
        title: "Error",
        description: "Failed to add state to comparison",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-navy-950 rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-white mb-6">
        State Rankings vs National Average
      </h2>

      <div className="space-y-4">
        {selectedStates.map((state, index) => (
          <div 
            key={index}
            className="bg-navy-900/80 backdrop-blur-sm rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              {state.state_name}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">Firm Density</span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-xl font-semibold">
                    {formatNumber(state.firm_density)}
                  </span>
                  {state.growth_rate && state.growth_rate > 0 ? (
                    <div className="flex items-center text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>{formatNumber(state.growth_rate)}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-400">
                      <TrendingDown className="w-4 h-4" />
                      <span>{formatNumber(state.growth_rate)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {selectedStates.length < 3 && (
          <Button
            variant="ghost" 
            className="w-full h-24 border-2 border-dashed border-white/10 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-white/5"
            onClick={() => handleAddState("06")} // Example: Add California
          >
            + Add State
          </Button>
        )}
      </div>
    </div>
  );
}