import { useState } from "react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Brain, LineChart, Target, Filter, Search, ChartBar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const InteractiveToolsSection = () => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedMetric, setSelectedMetric] = useState<string>("employeeCount");

  const { data: firmData, isLoading } = useQuery({
    queryKey: ['firms', selectedState],
    queryFn: async () => {
      const query = supabase
        .from('canary_firms_data')
        .select('*');
      
      if (selectedState) {
        query.eq('STATE', selectedState);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const metrics = {
    employeeCount: "Employee Count",
    followerCount: "Social Following",
    foundedOn: "Years in Business"
  };

  const getMetricValue = (firm: any, metric: string) => {
    switch(metric) {
      case 'employeeCount':
        return firm.employeeCount || 0;
      case 'followerCount':
        return firm.followerCount || 0;
      case 'foundedOn':
        return new Date().getFullYear() - (firm.foundedOn || new Date().getFullYear());
      default:
        return 0;
    }
  };

  const getAverageMetric = () => {
    if (!firmData?.length) return 0;
    const sum = firmData.reduce((acc, firm) => acc + getMetricValue(firm, selectedMetric), 0);
    return Math.round(sum / firmData.length);
  };

  return (
    <div className="min-h-screen bg-black/95 relative z-20 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
            Interactive Market Analysis
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore real market data and make informed decisions with our interactive tools
          </p>
        </div>

        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-[600px] mx-auto mb-8">
            <TabsTrigger value="discover">Market Explorer</TabsTrigger>
            <TabsTrigger value="analyze">Metric Analysis</TabsTrigger>
            <TabsTrigger value="compare">Comparisons</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Search className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Market Explorer</h3>
                </div>
                <div className="space-y-4">
                  <select
                    className="w-full p-2 rounded bg-black/50 text-white border border-white/20"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                  >
                    <option value="">All States</option>
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                    <option value="NY">New York</option>
                    <option value="FL">Florida</option>
                  </select>
                  
                  <div className="text-gray-300">
                    <p className="mb-2">Market Size:</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {isLoading ? "Loading..." : `${firmData?.length || 0} firms`}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Filter className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Metric Analysis</h3>
                </div>
                <div className="space-y-4">
                  <select
                    className="w-full p-2 rounded bg-black/50 text-white border border-white/20"
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                  >
                    {Object.entries(metrics).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  
                  <div className="text-gray-300">
                    <p className="mb-2">Average {metrics[selectedMetric as keyof typeof metrics]}:</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {isLoading ? "Loading..." : getAverageMetric()}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analyze" className="space-y-8">
            <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <ChartBar className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Distribution Analysis</h3>
              </div>
              <div className="h-64 flex items-center justify-center text-gray-400">
                Interactive charts coming soon...
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="compare" className="space-y-8">
            <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Market Comparison</h3>
              </div>
              <div className="h-64 flex items-center justify-center text-gray-400">
                Comparison tools coming soon...
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};