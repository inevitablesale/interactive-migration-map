import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Database, Filter, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  state: z.string({
    required_error: "Please select a state",
  }),
});

export default function CensusExplorer() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Query for populating state dropdown
  const { data: states } = useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_fips_codes')
        .select('state, STATEFP')
        .order('state');
      
      if (error) throw error;
      return data;
    }
  });

  // Only fetch census data when state is selected and form submitted
  const { data: censusData, isLoading, error } = useQuery({
    queryKey: ['censusMetrics', selectedState],
    enabled: !!selectedState,
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('census-data', {
        body: { stateFips: selectedState }
      });
      
      if (error) {
        toast({
          title: "Error fetching census data",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data;
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSelectedState(values.state);
  }

  return (
    <div className="min-h-screen bg-black/95">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Census Data Explorer</h1>
          <p className="text-gray-400">
            Analyze Census Bureau ACS and CBP data for market insights
          </p>
        </div>

        <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10 mb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Select State</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue placeholder="Choose a state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-900 border-white/10">
                        {states?.map((state) => (
                          <SelectItem key={state.STATEFP} value={state.STATEFP}>
                            {state.state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Load Census Data"}
              </Button>
            </form>
          </Form>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Data Sources</h3>
            </div>
            <div className="space-y-2 text-gray-400">
              <p>• Census Bureau ACS</p>
              <p>• County Business Patterns</p>
              <p>• Economic Indicators</p>
            </div>
          </Card>

          <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Analysis Tools</h3>
            </div>
            <div className="space-y-2 text-gray-400">
              <p>• Demographic Analysis</p>
              <p>• Business Pattern Insights</p>
              <p>• Market Comparisons</p>
            </div>
          </Card>

          <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Export Options</h3>
            </div>
            <div className="space-y-2 text-gray-400">
              <p>• Custom Reports</p>
              <p>• Raw Data Export</p>
              <p>• Visualization Export</p>
            </div>
          </Card>
        </div>

        {censusData && (
          <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6">Census Data Overview</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={censusData}>
                <XAxis 
                  dataKey="geo_id" 
                  stroke="#9CA3AF" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px'
                  }}
                />
                <Bar 
                  dataKey="total_pop" 
                  name="Population"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </div>
  );
}