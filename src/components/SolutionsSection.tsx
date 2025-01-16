import { ArrowRight, Brain, LineChart, ShieldCheck, Users, Target, TrendingUp, DollarSign, Building2, Info } from "lucide-react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

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
      title: "Set up your Canary",
      description: "We're here to tailor acquisition opportunities to your unique preferences. Let's get started by understanding your goals and requirements.",
      step: 1,
      totalSteps: 7
    },
    assess: {
      title: "Strategic Market Entry",
      items: [
        {
          title: "Risk Assessment",
          description: "Comprehensive risk analysis",
          tag: "Multi-Factor",
          tagDetail: "Dynamic updates",
          icon: ShieldCheck,
          color: "text-purple-400",
          bgColor: "bg-purple-950/40"
        },
        {
          title: "Value Analysis",
          description: "Complete market perspective",
          tag: "360°",
          tagDetail: "Full coverage",
          icon: LineChart,
          color: "text-pink-400",
          bgColor: "bg-pink-950/40"
        },
        {
          title: "Competitive Edge",
          description: "First-mover advantage",
          tag: "Early",
          tagDetail: "Market leadership",
          icon: Users,
          color: "text-orange-400",
          bgColor: "bg-orange-950/40"
        }
      ]
    },
    plan: {
      title: "Set up your Canary",
      description: "We're here to tailor acquisition opportunities to your unique preferences. Let's get started by understanding your goals and requirements.",
      step: 1,
      totalSteps: 7
    }
  };

  return (
    <div className="min-h-screen bg-black/95 relative z-20 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
            Data-Driven Market Intelligence
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Unlock acquisition opportunities by combining comprehensive census data, public deal analytics, and proprietary off-market insights. Our unique three-pronged approach helps you discover high-potential markets before they become competitive.
          </p>
        </div>

        <Tabs defaultValue="analyze" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-[600px] mx-auto mb-8 bg-white/5">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="assess">Assess</TabsTrigger>
            <TabsTrigger value="plan">Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <div className="flex flex-col h-full">
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Step {solutions.analyze.step} of {solutions.analyze.totalSteps}</span>
                    </div>
                    <Progress value={(solutions.analyze.step / solutions.analyze.totalSteps) * 100} className="h-1 bg-gray-800" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-white mb-4">{solutions.analyze.title}</h3>
                    <p className="text-gray-400 mb-8">{solutions.analyze.description}</p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Get Started
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assess" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {solutions.assess.items.map((item, index) => (
                <Card key={index} className={`p-6 ${item.bgColor}`}>
                  <h3 className="flex items-center gap-2 text-2xl font-semibold text-white mb-6">
                    {item.icon && <item.icon className={`w-6 h-6 ${item.color}`} />}
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.description}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="plan" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <h3 className="text-lg font-semibold text-white">{solutions.plan.title}</h3>
                <p className="text-gray-400">{solutions.plan.description}</p>
                <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
