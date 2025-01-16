import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight, Users, Building2, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { ComparisonCharts } from "./comparison/ComparisonCharts";
import { ScenarioModeling } from "./comparison/ScenarioModeling";

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
  const [activeTab, setActiveTab] = useState("charts");
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

  const handleUpdateScenario = (updatedData: StateData[]) => {
    setStateData(updatedData);
  };

  return (
    <div className={`p-4 ${embedded ? "max-w-4xl" : "max-w-6xl"} mx-auto`}>
      <Tabs defaultValue="charts" className="mb-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="charts">Comparison Charts</TabsTrigger>
          <TabsTrigger value="scenario">Scenario Modeling</TabsTrigger>
        </TabsList>

        <TabsContent value="charts">
          <ComparisonCharts stateData={stateData} statesList={statesList} />
        </TabsContent>

        <TabsContent value="scenario">
          <ScenarioModeling stateData={stateData} statesList={statesList} onUpdateScenario={handleUpdateScenario} />
        </TabsContent>
      </Tabs>
    </div>
  );
}