import { useState } from "react";
import { FileText, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StateMetrics {
  STATEFP: string;
  B19013_001E: number | null;
  B23025_004E: number | null;
  B25077_001E: number | null;
  EMP: number | null;
  ESTAB: number | null;
}

interface StateData extends Partial<StateMetrics> {
  state_name?: string;
  growth_rate?: number;
  firm_density?: number;
}

const fetchStateData = async (stateFp: string): Promise<StateData> => {
  // Fetch state name
  const { data: stateData, error: stateError } = await supabase
    .from('state_fips_codes')
    .select('state')
    .eq('fips_code', stateFp)
    .single();

  if (stateError) throw stateError;

  // Fetch metrics
  const { data: metricsData, error: metricsError } = await supabase
    .from('state_data')
    .select('STATEFP, B23025_004E, EMP, ESTAB')
    .eq('STATEFP', stateFp)
    .single();

  if (metricsError) throw metricsError;

  // Fetch growth trends
  const { data: trendsData, error: trendsError } = await supabase
    .rpc('get_market_trends')
    .eq('statefp', stateFp)
    .single();

  if (trendsError) throw trendsError;

  // Calculate firm density
  const firmDensity = metricsData.ESTAB && metricsData.B23025_004E ? 
    (metricsData.ESTAB / metricsData.B23025_004E) * 10000 : null;

  return {
    state_name: stateData.state,
    growth_rate: trendsData?.growth_rate || null,
    firm_density: firmDensity,
  };
};

const formatNumber = (value: number | null) => {
  if (value === null) return 'N/A';
  return value.toFixed(2);
};

const formatPercentage = (value: number | null) => {
  if (value === null) return 'N/A';
  return `${value.toFixed(1)}%`;
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

  const handleRemoveState = (index: number) => {
    setSelectedStates(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {selectedStates.map((state, index) => (
        <div 
          key={index}
          className="bg-navy-900/80 backdrop-blur-sm border border-white/10 rounded-lg p-6 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">
                {state.state_name || `State ${index + 1}`}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-400 hover:text-blue-300"
              onClick={() => handleRemoveState(index)}
            >
              ×
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-4 h-4" />
                <span>Firm Density</span>
              </div>
              <span className="text-white font-medium">
                {formatNumber(state.firm_density)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span>Growth Rate</span>
              </div>
              <span className="text-white font-medium">
                {formatPercentage(state.growth_rate)}
              </span>
            </div>
          </div>
        </div>
      ))}

      {selectedStates.length < 3 && (
        <div 
          className="bg-navy-900/40 border border-white/10 rounded-lg p-6 flex items-center justify-center"
          onClick={() => handleAddState("06")} // Example: Add California
        >
          <span className="text-blue-400">+ Add State</span>
        </div>
      )}
    </div>
  );
}