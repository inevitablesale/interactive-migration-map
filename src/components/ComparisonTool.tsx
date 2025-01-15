import { useState } from "react";
import { GripHorizontal, X, Lock, TrendingUp, Users, Building2, DollarSign, GraduationCap, ArrowUpRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ComparisonCharts } from "./comparison/ComparisonCharts";
import { ScenarioModeling } from "./comparison/ScenarioModeling";

interface ComparisonToolProps {
  embedded?: boolean;
}

interface StateData {
  STATEFP: string;
  EMP: number | null;
  PAYANN: number | null;
  ESTAB: number | null;
  B19013_001E: number | null;
  B23025_004E: number | null;
  B25077_001E: number | null;
  displayName?: string;
}

const fetchStateData = async (stateFp: string) => {
  const { data, error } = await supabase
    .from('state_data')
    .select('STATEFP, EMP, PAYANN, ESTAB, B19013_001E, B23025_004E, B25077_001E')
    .eq('STATEFP', stateFp)
    .single();

  if (error) throw error;
  return data;
};

const fetchAllStates = async () => {
  const { data, error } = await supabase
    .from('state_fips_codes')
    .select('*')
    .order('state');

  if (error) throw error;
  return data;
};

const formatNumber = (value: string | number | null) => {
  if (value === null) return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'N/A';
  return new Intl.NumberFormat('en-US').format(num);
};

const formatCurrency = (value: number | null) => {
  if (value === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function ComparisonTool({ embedded = false }: ComparisonToolProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [scenarioData, setScenarioData] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: statesList } = useQuery({
    queryKey: ['statesList'],
    queryFn: fetchAllStates,
  });

  const { data: stateData } = useQuery({
    queryKey: ['stateData', selectedStates],
    queryFn: async () => {
      if (selectedStates.length === 0) return [];
      const promises = selectedStates.map(fetchStateData);
      return Promise.all(promises);
    },
    enabled: selectedStates.length > 0,
  });

  const handleStateSelect = (value: string) => {
    if (selectedStates.length >= 2 && !selectedStates.includes(value)) {
      toast({
        title: "Maximum States Selected",
        description: "You can compare up to 2 states at a time",
      });
      return;
    }
    
    if (selectedStates.includes(value)) {
      setSelectedStates(prev => prev.filter(state => state !== value));
      setScenarioData([]);
    } else {
      setSelectedStates(prev => [...prev, value]);
    }
  };

  const handleExport = () => {
    const data = scenarioData.length ? scenarioData : stateData;
    if (!data) return;

    const formattedData = data.map(state => ({
      State: statesList?.find(s => s.fips_code === state.STATEFP)?.state,
      Employment: state.EMP,
      'Annual Payroll': state.PAYANN,
      Establishments: state.ESTAB,
      'Median Income': state.B19013_001E,
      'Labor Force': state.B23025_004E,
    }));

    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(formattedData[0]).join(",") + "\n" +
      formattedData.map(row => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "state_comparison.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Your comparison data has been exported to CSV",
    });
  };

  const handleStateClick = (stateFp: string) => {
    navigate(`/state-market-report/${stateFp}`);
  };

  const renderMetricComparison = (metric: keyof StateData, label: string, icon: React.ReactNode, formatFn = formatNumber, suffix = '') => {
    if (!stateData?.length) return null;
    const data = scenarioData.length ? scenarioData : stateData;
    const values = data.map(state => state[metric]);
    const max = Math.max(...values.filter(v => v !== null) as number[]);
    
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white/80">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {data.map((state, index) => {
            const value = state[metric];
            const isHighest = value === max;
            
            return (
              <div 
                key={index} 
                className={cn(
                  "bg-[#1A1A1A] p-4 rounded-lg transition-colors cursor-pointer hover:bg-[#252525]",
                  isHighest && "bg-[#252525] border border-white/10"
                )}
                onClick={() => handleStateClick(state.STATEFP)}
              >
                <div className="text-sm text-white/70 mb-1">
                  {statesList?.find(s => s.fips_code === state.STATEFP)?.state || `State ${index + 1}`}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-medium text-white">
                    {formatFn(value)}{suffix}
                  </div>
                  {isHighest && (
                    <ArrowUpRight className="h-5 w-5 text-green-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!embedded && !isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed right-4 top-20 bg-blue-500 hover:bg-blue-600"
      >
        <GripHorizontal className="h-4 w-4 mr-2" />
        Compare States
      </Button>
    );
  }

  const content = (
    <div className={cn("bg-[#111111] backdrop-blur-md rounded-lg border border-white/10", 
      !embedded && "fixed right-4 top-20 w-[800px]")}>
      {!embedded && (
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-xl font-medium text-white">Compare States</h3>
          <div className="flex items-center gap-2">
            {stateData && stateData.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                className="text-white/60 hover:text-white"
              >
                <Download className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-white/60 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
      
      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <h4 className="text-lg text-white/90">Select States to Compare</h4>
          <Select onValueChange={handleStateSelect}>
            <SelectTrigger className="w-full bg-[#1A1A1A] border-white/10 text-white h-12 text-lg">
              <SelectValue placeholder="Choose a state" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              {statesList?.map((state) => (
                <SelectItem 
                  key={state.fips_code} 
                  value={state.fips_code}
                  className="text-white hover:bg-white/10"
                >
                  {state.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-3 flex-wrap">
            {selectedStates.map((stateFp) => (
              <Button
                key={stateFp}
                variant="secondary"
                size="sm"
                onClick={() => handleStateSelect(stateFp)}
                className="bg-[#1A1A1A] hover:bg-[#252525] text-blue-400 border border-white/10 px-4 py-2"
              >
                {statesList?.find(s => s.fips_code === stateFp)?.state}
                <X className="h-4 w-4 ml-2" />
              </Button>
            ))}
          </div>
        </div>

        {stateData && stateData.length > 0 ? (
          <Tabs defaultValue="metrics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-[#1A1A1A]">
              <TabsTrigger value="metrics" className="data-[state=active]:bg-blue-500/20">
                Key Metrics
              </TabsTrigger>
              <TabsTrigger value="charts" className="data-[state=active]:bg-blue-500/20">
                Charts
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="data-[state=active]:bg-blue-500/20">
                Scenarios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-6">
                  {renderMetricComparison('EMP', 'Employment', <Users className="h-4 w-4" />)}
                  {renderMetricComparison('PAYANN', 'Annual Payroll', <DollarSign className="h-4 w-4" />, formatCurrency)}
                  {renderMetricComparison('ESTAB', 'Establishments', <Building2 className="h-4 w-4" />)}
                </div>
                <div className="space-y-6">
                  {renderMetricComparison('B19013_001E', 'Median Income', <TrendingUp className="h-4 w-4" />, formatCurrency)}
                  {renderMetricComparison('B23025_004E', 'Labor Force', <Users className="h-4 w-4" />)}
                  {renderMetricComparison(
                    'B25077_001E', 
                    'Housing Affordability', 
                    <GraduationCap className="h-4 w-4" />,
                    (value) => formatCurrency(value as number)
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="charts">
              <ComparisonCharts 
                stateData={scenarioData.length ? scenarioData : stateData} 
                statesList={statesList || []} 
              />
            </TabsContent>

            <TabsContent value="scenarios">
              <ScenarioModeling 
                stateData={stateData} 
                statesList={statesList || []} 
                onUpdateScenario={setScenarioData}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/60">
              <Lock className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">Select states to compare</span>
            </div>
            <p className="text-xs text-white/60">
              Compare states side by side with detailed metrics and insights
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return embedded ? content : (
    <div className="animate-fade-in">
      {content}
    </div>
  );
}
