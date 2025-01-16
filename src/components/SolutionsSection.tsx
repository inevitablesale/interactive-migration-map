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
          icon: Brain,
          description: "Markets analyzed via AI",
          trend: "+12% this month",
          color: "bg-blue-500/10 text-blue-500"
        },
        {
          title: "Market Coverage",
          value: "493",
          icon: Target,
          description: "Regions with competitive analysis",
          trend: "92% accuracy",
          color: "bg-amber-500/10 text-amber-500"
        },
        {
          title: "Growth Opportunities",
          value: "500+",
          icon: TrendingUp,
          description: "New acquisition opportunities",
          trend: "Updated daily",
          color: "bg-green-500/10 text-green-500"
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
          description: "Based on economic indicators",
          trend: "Strong outlook",
          color: "bg-purple-500/10 text-purple-500"
        },
        {
          title: "Average Deal Size",
          value: "$2.1M",
          icon: DollarSign,
          description: "Typical transaction value",
          trend: "+5% YoY",
          color: "bg-pink-500/10 text-pink-500"
        },
        {
          title: "Market Density",
          value: "Medium",
          icon: Users,
          description: "Current market saturation",
          trend: "Optimal entry point",
          color: "bg-orange-500/10 text-orange-500"
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
          description: "Matches meeting buyer criteria",
          trend: "Industry leading",
          color: "bg-teal-500/10 text-teal-500"
        },
        {
          title: "ROI Potential",
          value: "24%",
          icon: TrendingUp,
          description: "Average growth opportunity",
          trend: "Above market avg",
          color: "bg-indigo-500/10 text-indigo-500"
        },
        {
          title: "Market Position",
          value: "Top 10%",
          icon: LineChart,
          description: "Competitive ranking",
          trend: "Strong momentum",
          color: "bg-rose-500/10 text-rose-500"
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
            Unlock acquisition opportunities by combining comprehensive census data, public deal analytics, and proprietary off-market insights. Our unique three-pronged approach helps you discover high-potential markets before they become competitive.
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
                      <div key={index} className={`${metric.color} p-4 rounded-lg backdrop-blur-sm`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <metric.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{metric.title}</span>
                          </div>
                          <span className="text-lg font-semibold">{metric.value}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs opacity-80">{metric.description}</p>
                          <span className="text-xs font-medium">{metric.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                  {key === "analyze" && <ComparisonTool embedded={true} />}
                  {key === "assess" && <AIDealSourcer embedded={true} />}
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