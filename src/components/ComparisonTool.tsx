import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { ComparisonCharts } from "./comparison/ComparisonCharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

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

  // Fetch state names and FIPS codes
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

  return (
    <div className={`p-4 ${embedded ? "max-w-4xl" : "max-w-6xl"} mx-auto`}>
      <div className="bg-black/40 backdrop-blur-md rounded-lg border border-white/10 p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">State Comparison Tool</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Select First State</label>
            <Select
              value={selectedStates[0]}
              onValueChange={(value) => handleStateSelect(value, 0)}
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
          </div>
          
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Select Second State</label>
            <Select
              value={selectedStates[1]}
              onValueChange={(value) => handleStateSelect(value, 1)}
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
          </div>
        </div>

        <ComparisonCharts stateData={stateData} statesList={statesList} />
      </div>
    </div>
  );
}