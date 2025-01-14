import { useState } from "react";
import { GripHorizontal, X, Lock, TrendingUp, Users, Building2, DollarSign, Home } from "lucide-react";
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
  employment_rate?: number;
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
    .select('STATEFP, B19013_001E, B23025_004E, B25077_001E, EMP, ESTAB')
    .eq('STATEFP', stateFp)
    .single();

  if (metricsError) throw metricsError;

  // Fetch growth trends
  const { data: trendsData, error: trendsError } = await supabase
    .rpc('get_market_trends')
    .eq('statefp', stateFp)
    .single();

  if (trendsError) throw trendsError;

  // Calculate employment rate
  const employmentRate = metricsData.B23025_004E && metricsData.EMP ? 
    (metricsData.EMP / metricsData.B23025_004E) * 100 : null;

  // Return only the necessary data as plain objects
  return {
    state_name: stateData.state,
    growth_rate: trendsData?.growth_rate || null,
    firm_density: metricsData.ESTAB && metricsData.B23025_004E ? 
      (metricsData.ESTAB / metricsData.B23025_004E) * 10000 : null,
    employment_rate: employmentRate,
    B19013_001E: metricsData.B19013_001E,
    B25077_001E: metricsData.B25077_001E
  };
};

const formatNumber = (value: string | number) => {
  if (typeof value === 'string') value = parseFloat(value);
  return new Intl.NumberFormat('en-US').format(value);
};

const formatPercentage = (value: number | null) => {
  if (value === null) return 'N/A';
  return `${value.toFixed(1)}%`;
};

const formatCurrency = (value: number | null) => {
  if (value === null) return 'N/A';
  return `$${new Intl.NumberFormat('en-US').format(value)}`;
};

export function ComparisonTool() {
  const [selectedStates, setSelectedStates] = useState<StateData[]>([]);
  const { toast } = useToast();

  const handleAddState = async (stateFp: string) => {
    try {
      const stateData = await fetchStateData(stateFp);
      
      // Create a new plain object with only the data we need
      const newState: StateData = {
        state_name: stateData.state_name,
        growth_rate: stateData.growth_rate,
        firm_density: stateData.firm_density,
        employment_rate: stateData.employment_rate,
        B19013_001E: stateData.B19013_001E,
        B25077_001E: stateData.B25077_001E
      };

      setSelectedStates(prev => [...prev, newState]);
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

  const renderMetricComparison = (
    key: keyof StateData,
    label: string,
    icon: JSX.Element,
    formatter: (value: any) => string = formatNumber
  ) => {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1 text-blue-400">
          {icon}
          <span>{label}</span>
        </div>
        <div className="flex-1 flex items-center justify-end gap-4">
          {selectedStates.map((state, index) => (
            <span key={index} className="text-white">
              {formatter(state[key])}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Compare Markets</h3>
        </div>
        {selectedStates.length === 0 && (
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <Lock className="w-4 h-4" />
            <span>Select states to compare</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {selectedStates.length > 0 ? (
          <div className="space-y-2">
            <div className="flex justify-end gap-4 mb-4">
              {selectedStates.map((state, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-white font-medium">{state.state_name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveState(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {renderMetricComparison('firm_density', 'Firm Density', <Building2 className="h-4 w-4" />, 
              (value) => value ? formatNumber(value.toFixed(2)) : 'N/A')}
            {renderMetricComparison('growth_rate', 'Growth Rate', <TrendingUp className="h-4 w-4" />, 
              (value) => formatPercentage(value))}
            {renderMetricComparison('B19013_001E', 'Median Income', <DollarSign className="h-4 w-4" />,
              formatCurrency)}
            {renderMetricComparison('employment_rate', 'Employment Rate', <Users className="h-4 w-4" />,
              formatPercentage)}
            {renderMetricComparison('B25077_001E', 'Median Home Value', <Home className="h-4 w-4" />,
              formatCurrency)}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="h-8 bg-white/5 rounded animate-pulse" />
            <div className="h-8 bg-white/5 rounded animate-pulse" />
            <div className="h-8 bg-white/5 rounded animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}