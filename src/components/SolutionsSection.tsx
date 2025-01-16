import { ArrowRight, Brain, LineChart, ShieldCheck, Users, Target, TrendingUp, DollarSign } from "lucide-react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ComparisonTool } from "./ComparisonTool";
import { AIDealSourcer } from "./analytics/AIDealSourcer";

export const SolutionsSection = () => {
  const [activeTab, setActiveTab] = useState("analyze");

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
    analyze: {
      title: "State Market Comparison",
      description: "Compare key metrics across states to identify optimal markets",
      metrics: [
        {
          title: "Markets Analyzed",
          value: "872",
          icon: Users,
          description: "Markets analyzed via AI"
        },
        {
          title: "Market Coverage",
          value: "493",
          icon: Target,
          description: "Regions with competitive analysis"
        },
        {
          title: "Monthly Growth",
          value: "500+",
          icon: TrendingUp,
          description: "New acquisition opportunities"
        }
      ]
    },
    assess: {
      title: "AI Deal Sourcing",
      description: "Let AI find your ideal acquisition targets",
      metrics: [
        {
          title: "Market Stability",
          value: marketData?.length ? "High" : "Loading...",
          icon: ShieldCheck,
          description: "Based on economic indicators"
        },
        {
          title: "Average Deal Size",
          value: "$2.1M",
          icon: DollarSign,
          description: "Typical transaction value"
        },
        {
          title: "Market Density",
          value: "Medium",
          icon: Users,
          description: "Current market saturation"
        }
      ]
    },
    plan: {
      title: "Strategic Planning",
      description: "Transform market insights into actionable acquisition strategies",
      metrics: [
        {
          title: "Success Rate",
          value: "92%",
          icon: Target,
          description: "Matches meeting buyer criteria"
        },
        {
          title: "ROI Potential",
          value: "24%",
          icon: TrendingUp,
          description: "Average growth opportunity"
        },
        {
          title: "Market Position",
          value: "Top 10%",
          icon: LineChart,
          description: "Competitive ranking"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-black/95 relative z-20 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
            Data-Driven Market Intelligence
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Make confident acquisition decisions with comprehensive market analysis and real-time insights.
          </p>
        </div>

        <Tabs defaultValue="analyze" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-[600px] mx-auto mb-8">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="assess">Assess</TabsTrigger>
            <TabsTrigger value="plan">Plan</TabsTrigger>
          </TabsList>

          {Object.entries(solutions).map(([key, solution]) => (
            <TabsContent key={key} value={key} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    {key === "analyze" && <Brain className="w-5 h-5 text-yellow-400" />}
                    {key === "assess" && <ShieldCheck className="w-5 h-5 text-yellow-400" />}
                    {key === "plan" && <LineChart className="w-5 h-5 text-yellow-400" />}
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
                  {key === "analyze" && (
                    <ComparisonTool embedded={true} />
                  )}
                  {key === "assess" && (
                    <AIDealSourcer embedded={true} />
                  )}
                  {key === "plan" && (
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
                                dataKey="firms"
                                fill="#EAB308"
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
