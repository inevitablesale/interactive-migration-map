import { ArrowRight, Brain, LineChart, ShieldCheck, Users, Target, TrendingUp, DollarSign } from "lucide-react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const SolutionsSection = () => {
  const [activeTab, setActiveTab] = useState("discover");

  // Fetch aggregated data for visualization
  const { data: marketData } = useQuery({
    queryKey: ['marketMetrics'],
    queryFn: async () => {
      const { data: stateData, error } = await supabase
        .from('state_data')
        .select('STATEFP, EMP, PAYANN, ESTAB, B19013_001E')
        .order('EMP', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return stateData?.map(state => ({
        name: `State ${state.STATEFP}`,
        employees: state.EMP || 0,
        firms: state.ESTAB || 0,
        payroll: state.PAYANN || 0,
        income: state.B19013_001E || 0
      }));
    }
  });

  const solutions = {
    discover: {
      title: "Market Analysis",
      description: "Identify untapped opportunities with data-driven insights",
      metrics: [
        {
          title: "Total Firms",
          value: marketData?.reduce((sum, state) => sum + state.firms, 0)?.toLocaleString() || "Loading...",
          icon: Users,
          description: "Active accounting firms in target markets"
        },
        {
          title: "Market Potential",
          value: marketData?.reduce((sum, state) => sum + state.payroll, 0)?.toLocaleString() || "Loading...",
          icon: Target,
          description: "Annual payroll volume ($)"
        },
        {
          title: "Growth Rate",
          value: "+12.3%",
          icon: TrendingUp,
          description: "Year-over-year market growth"
        }
      ]
    },
    assess: {
      title: "Risk Assessment",
      description: "Make data-driven decisions with confidence",
      metrics: [
        {
          title: "Market Stability",
          value: "8.7/10",
          icon: ShieldCheck,
          description: "Based on economic indicators"
        },
        {
          title: "Revenue Potential",
          value: "$2.1M",
          icon: DollarSign,
          description: "Average per firm"
        },
        {
          title: "Competition Index",
          value: "Medium",
          icon: Users,
          description: "Market saturation level"
        }
      ]
    },
    decide: {
      title: "Decision Support",
      description: "Transform insights into actionable decisions",
      metrics: [
        {
          title: "Opportunity Score",
          value: "92/100",
          icon: Target,
          description: "Composite market rating"
        },
        {
          title: "ROI Forecast",
          value: "24%",
          icon: TrendingUp,
          description: "Projected 3-year return"
        },
        {
          title: "Market Position",
          value: "Top 10%",
          icon: LineChart,
          description: "Relative to competitors"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-black/95 relative z-20 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
            Transform Data into Decisions
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Don't just collect data - use it to drive meaningful change in your acquisition strategy
          </p>
        </div>

        <Tabs defaultValue="discover" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-[600px] mx-auto mb-8">
            <TabsTrigger value="discover">Analyze</TabsTrigger>
            <TabsTrigger value="assess">Assess</TabsTrigger>
            <TabsTrigger value="decide">Decide</TabsTrigger>
          </TabsList>

          {Object.entries(solutions).map(([key, solution]) => (
            <TabsContent key={key} value={key} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    {key === "discover" && <Brain className="w-5 h-5 text-yellow-400" />}
                    {key === "assess" && <ShieldCheck className="w-5 h-5 text-yellow-400" />}
                    {key === "decide" && <LineChart className="w-5 h-5 text-yellow-400" />}
                    <h3 className="text-lg font-semibold text-white">{solution.title}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {solution.metrics.map((metric, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <metric.icon className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-gray-300">{metric.title}</span>
                          </div>
                          <span className="text-lg font-semibold text-white">{metric.value}</span>
                        </div>
                        <p className="text-xs text-gray-400">{metric.description}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                  <div className="h-full flex flex-col">
                    <h4 className="text-sm font-medium text-gray-300 mb-4">Market Overview</h4>
                    {marketData && (
                      <div className="flex-1">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={marketData}>
                            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                            <YAxis stroke="#9CA3AF" fontSize={12} />
                            <Tooltip 
                              contentStyle={{ 
                                background: 'rgba(0,0,0,0.8)', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '4px'
                              }}
                            />
                            <Bar 
                              dataKey={key === "discover" ? "firms" : key === "assess" ? "employees" : "payroll"}
                              fill="#EAB308"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};