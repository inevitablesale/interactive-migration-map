import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { ComparisonCharts } from "./comparison/ComparisonCharts";

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

  return (
    <div className={`p-4 ${embedded ? "max-w-4xl" : "max-w-6xl"} mx-auto`}>
      <div className="bg-black/40 backdrop-blur-md rounded-lg border border-white/10 p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">State Comparison Tool</h2>
        <ComparisonCharts stateData={stateData} statesList={statesList} />
      </div>
    </div>
  );
}