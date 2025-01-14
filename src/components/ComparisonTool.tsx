import { useState } from "react";
import { GripHorizontal, X, Lock, TrendingUp, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface StateData {
  STATEFP: string;
  EMP: number | null;
  PAYANN: number | null;
  ESTAB: number | null;
  B19013_001E: number | null;
  B23025_004E: number | null;
  B25077_001E: number | null;
  state_name?: string;
  growth_rate?: number;
  firm_density?: number;
}

const fetchStateData = async (stateFp: string) => {
  // First get the state name
  const { data: stateData, error: stateError } = await supabase
    .from('state_fips_codes')
    .select('state')
    .eq('fips_code', stateFp.padStart(2, '0'))
    .single();

  if (stateError) throw stateError;

  // Then get the metrics
  const { data: metrics, error: metricsError } = await supabase
    .from('state_data')
    .select('STATEFP, EMP, PAYANN, ESTAB, B19013_001E, B23025_004E, B25077_001E')
    .eq('STATEFP', stateFp)
    .single();

  if (metricsError) throw metricsError;

  // Get growth rate from the market trends function
  const { data: trends, error: trendsError } = await supabase
    .rpc('get_market_trends')
    .eq('statefp', stateFp)
    .single();

  if (trendsError) throw trendsError;

  return {
    ...metrics,
    state_name: stateData.state,
    growth_rate: trends.growth_rate,
    firm_density: metrics.ESTAB && metrics.B23025_004E ? 
      (metrics.ESTAB / metrics.B23025_004E) * 10000 : 0
  };
};

const formatNumber = (value: string | number | null) => {
  if (value === null) return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'N/A';
  return new Intl.NumberFormat('en-US').format(num);
};

const formatPercentage = (value: number | null) => {
  if (value === null) return 'N/A';
  return `${value.toFixed(1)}%`;
};

export function ComparisonTool() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: stateData } = useQuery({
    queryKey: ['stateData', selectedStates],
    queryFn: async () => {
      if (selectedStates.length === 0) return [];
      const promises = selectedStates.map(fetchStateData);
      return Promise.all(promises);
    },
    enabled: selectedStates.length > 0,
  });

  const handleCompare = () => {
    toast({
      title: "Premium Feature",
      description: "Upgrade to unlock detailed firm comparisons",
    });
  };

  const renderMetricComparison = (metric: keyof StateData, label: string, icon: React.ReactNode, formatter?: (value: any) => string) => {
    if (!stateData?.length) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white/80">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {stateData.map((state, index) => (
            <div key={index} className="bg-white/5 p-2 rounded">
              <div className="text-xs text-white/60">{state.state_name || `State ${index + 1}`}</div>
              <div className="text-sm font-medium text-white">
                {formatter ? formatter(state[metric]) : formatNumber(state[metric])}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed right-4 top-20 bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/70"
      >
        <GripHorizontal className="h-4 w-4 mr-2" />
        Compare States
      </Button>
    );
  }

  return (
    <div className="fixed right-4 top-20 w-96 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 shadow-xl animate-fade-in">
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <h3 className="text-sm font-medium text-white">Compare States</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-white/60 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 space-y-4">
        {stateData && stateData.length > 0 ? (
          <div className="space-y-4">
            {renderMetricComparison('firm_density', 'Firm Density', <Building2 className="h-4 w-4" />, 
              (value) => value ? formatNumber(value.toFixed(2)) : 'N/A')}
            {renderMetricComparison('growth_rate', 'Growth Rate', <TrendingUp className="h-4 w-4" />, 
              (value) => formatPercentage(value))}
            {renderMetricComparison('ESTAB', 'Total Firms', <Users className="h-4 w-4" />)}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/60">
              <Lock className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">Premium Feature</span>
            </div>
            <p className="text-xs text-white/60">
              Compare states side by side with detailed metrics and insights
            </p>
            <Button
              onClick={handleCompare}
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Upgrade to Compare
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}