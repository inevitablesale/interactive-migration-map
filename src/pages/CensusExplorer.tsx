import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Database, Filter, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function CensusExplorer() {
  const { data: censusData } = useQuery({
    queryKey: ['censusMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('county_data')
        .select(`
          STATEFP,
          COUNTYFP,
          COUNTYNAME,
          B01001_001E,
          B19013_001E,
          B23025_004E,
          B25077_001E,
          EMP,
          ESTAB,
          PAYANN
        `)
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-black/95">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Census Data Explorer</h1>
          <p className="text-gray-400">
            Analyze Census Bureau ACS and CBP data for market insights
          </p>
        </div>

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

        <Tabs defaultValue="demographics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-[600px] mx-auto mb-8 bg-white/5">
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="business">Business Patterns</TabsTrigger>
            <TabsTrigger value="economic">Economic Indicators</TabsTrigger>
          </TabsList>

          <TabsContent value="demographics">
            <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">Population Distribution</h3>
              {censusData && (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={censusData}>
                    <XAxis 
                      dataKey="COUNTYNAME" 
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
                      dataKey="B01001_001E" 
                      name="Population"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="business">
            <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">Business Establishments</h3>
              {censusData && (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={censusData}>
                    <XAxis 
                      dataKey="COUNTYNAME" 
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
                      dataKey="ESTAB" 
                      name="Establishments"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="economic">
            <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">Median Income Distribution</h3>
              {censusData && (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={censusData}>
                    <XAxis 
                      dataKey="COUNTYNAME" 
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
                      dataKey="B19013_001E" 
                      name="Median Income"
                      fill="#F59E0B"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}