import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Database, Filter, Download } from "lucide-react";
import { runQuery } from "@/utils/bigQueryClient";

export default function CensusExplorer() {
  const { data: censusData, isLoading, error } = useQuery({
    queryKey: ['censusMetrics'],
    queryFn: async () => {
      const query = `
        SELECT 
          geo_id,
          total_pop,
          median_income,
          median_age
        FROM \`bigquery-public-data.census_bureau_acs.county_2019_5yr\`
        LIMIT 10
      `;
      return runQuery(query);
    }
  });

  return (
    <div className="min-h-screen bg-black/95">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error ? (
          <div className="text-red-500">
            Error loading census data. Please check your credentials and try again.
          </div>
        ) : isLoading ? (
          <div className="text-white">Loading census data...</div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
