import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { ComparisonCharts } from "./comparison/ComparisonCharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { ArrowRight, TrendingUp, Users, Building2, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface ComparisonToolProps {
  embedded?: boolean;
}

interface StateData {
  STATEFP: string;
  EMP?: number;
  PAYANN?: number;
  ESTAB?: number;
  B19013_001E?: number;
}

export function ComparisonTool({ embedded = false }: ComparisonToolProps) {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [statesList, setStatesList] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: marketData, isLoading } = useQuery({
    queryKey: ['marketData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_data')
        .select('*');

      if (error) {
        toast({
          title: "Error loading market data",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
  });

  const { data: states } = useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_fips_codes')
        .select('*');

      if (error) {
        toast({
          title: "Error loading states",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
  });

  useEffect(() => {
    if (states) {
      setStatesList(states);
    }
  }, [states]);

  useEffect(() => {
    if (marketData && selectedStates.length > 0) {
      const filteredData = marketData.filter(item => 
        selectedStates.includes(item.STATEFP)
      );
      setStateData(filteredData);
    }
  }, [marketData, selectedStates]);

  const handleStateSelect = (statefp: string, index: number) => {
    setSelectedStates(prev => {
      const newStates = [...prev];
      newStates[index] = statefp;
      return newStates;
    });
  };

  const calculateGrowthRate = (state: StateData) => {
    if (!state) return 0;
    return ((state.EMP || 0) / (state.ESTAB || 1)) * 100;
  };

  const calculateMarketShare = (state: StateData) => {
    if (!marketData || !state.ESTAB) return 0;
    const totalEstab = marketData.reduce((sum, s) => sum + (s.ESTAB || 0), 0);
    return (state.ESTAB / totalEstab) * 100;
  };

  return (
    <div className={`p-4 ${embedded ? "max-w-4xl" : "max-w-6xl"} mx-auto`}>
      <div className="bg-black/40 backdrop-blur-md rounded-lg border border-white/10 p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">State Comparison Tool</h2>
        
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[0, 1].map((index) => (
                  <div key={index}>
                    <label className="text-sm text-gray-400 mb-2 block">
                      Select {index === 0 ? "First" : "Second"} State
                    </label>
                    <div className="flex gap-2">
                      <Select
                        value={selectedStates[index]}
                        onValueChange={(value) => handleStateSelect(value, index)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                        <SelectContent>
                          {statesList.map((state) => (
                            <SelectItem key={state.STATEFP} value={state.STATEFP}>
                              {state.state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedStates[index] && (
                        <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/state-market-report/${selectedStates[index]}`)}
                          className="shrink-0"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedStates.length > 0 && stateData.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-white mb-4">Key Metrics Comparison</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {stateData.map((state, index) => {
                      const stateName = statesList.find(s => s.STATEFP === state.STATEFP)?.state;
                      const growthRate = calculateGrowthRate(state);
                      const marketShare = calculateMarketShare(state);
                      
                      return (
                        <div key={state.STATEFP} className="space-y-4">
                          <h4 className="text-md font-medium text-white">{stateName}</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/20 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Building2 className="w-4 h-4 text-blue-400" />
                                <span className="text-gray-400">Establishments</span>
                              </div>
                              <span className="text-xl font-semibold text-white">
                                {state.ESTAB?.toLocaleString()}
                              </span>
                              <div className="text-sm text-gray-400 mt-1">
                                {marketShare.toFixed(1)}% market share
                              </div>
                            </div>
                            
                            <div className="bg-black/20 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-green-400" />
                                <span className="text-gray-400">Employment</span>
                              </div>
                              <span className="text-xl font-semibold text-white">
                                {state.EMP?.toLocaleString()}
                              </span>
                              <div className="text-sm text-gray-400 mt-1">
                                {growthRate.toFixed(1)}% growth rate
                              </div>
                            </div>
                            
                            <div className="bg-black/20 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-4 h-4 text-yellow-400" />
                                <span className="text-gray-400">Annual Payroll</span>
                              </div>
                              <span className="text-xl font-semibold text-white">
                                ${(state.PAYANN || 0).toLocaleString()}
                              </span>
                              <div className="text-sm text-gray-400 mt-1">
                                ${((state.PAYANN || 0) / (state.EMP || 1)).toLocaleString()} per employee
                              </div>
                            </div>
                            
                            <div className="bg-black/20 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-purple-400" />
                                <span className="text-gray-400">Median Income</span>
                              </div>
                              <span className="text-xl font-semibold text-white">
                                ${state.B19013_001E?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="charts">
            <ComparisonCharts stateData={stateData} statesList={statesList} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}