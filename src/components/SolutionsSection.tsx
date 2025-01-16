import { ArrowRight, Brain, LineChart, ShieldCheck, Users, Target, FileText, List, FileDownload, Building2, Info, UserPlus } from "lucide-react";
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
    prospect: {
      title: "Smart Firm Lists & Reports",
      items: [
        {
          title: "Curated Firm Lists",
          description: "AI-powered firm discovery and filtering",
          tag: "Smart",
          tagDetail: "ML-driven",
          icon: List,
          color: "text-blue-400",
          bgColor: "bg-blue-950/40"
        },
        {
          title: "Market Reports",
          description: "Downloadable local market insights",
          tag: "Reports",
          tagDetail: "PDF & Excel",
          icon: FileDownload,
          color: "text-green-400",
          bgColor: "bg-green-950/40"
        },
        {
          title: "Firm Analytics",
          description: "Detailed firm performance metrics",
          tag: "Analytics",
          tagDetail: "Real-time",
          icon: FileText,
          color: "text-yellow-400",
          bgColor: "bg-yellow-950/40"
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
          <p className="text-gray-400 max-w-3xl mx-auto">
            Unlock acquisition opportunities by combining comprehensive census data, public deal analytics, and proprietary off-market insights. Our unique three-pronged approach helps you discover high-potential markets before they become competitive.
          </p>
        </div>

        <Tabs defaultValue="analyze" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-[600px] mx-auto mb-8 bg-white/5">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="assess">Assess</TabsTrigger>
            <TabsTrigger value="prospect">Prospect</TabsTrigger>
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

              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
                      <Building2 className="w-5 h-5" />
                      Accounting Industry Metrics
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Total Establishments</span>
                          <Info className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded bg-amber-500/20 text-amber-400">Average</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-400">4.6 per 10k residents</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Average Annual Payroll per Firm</span>
                          <Info className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">High Performance</span>
                      </div>
                      <p className="text-2xl font-bold text-emerald-400">$560.7K</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Average Salary per Employee</span>
                          <Info className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded bg-amber-500/20 text-amber-400">Average</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-400">$59.4K</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assess" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <h3 className="flex items-center gap-2 text-2xl font-semibold text-white mb-6">
                  <ShieldCheck className="w-6 h-6 text-yellow-400" />
                  {solutions.assess.title}
                </h3>
                <div className="space-y-4">
                  {solutions.assess.items.map((item, index) => (
                    <div key={index} className={`p-4 rounded-lg ${item.bgColor}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          <span className={`font-medium ${item.color}`}>{item.title}</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-medium ${item.color}`}>{item.tag}</span>
                          <div className="flex items-center gap-1 mt-1">
                            <ArrowRight className={`w-3 h-3 ${item.color}`} />
                            <span className="text-xs text-gray-400">{item.tagDetail}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <div className="h-full flex flex-col">
                  <h4 className="text-lg font-medium text-white mb-4">Market Density Overview</h4>
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
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="prospect" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <h3 className="flex items-center gap-2 text-2xl font-semibold text-white mb-6">
                  <List className="w-6 h-6 text-blue-400" />
                  {solutions.prospect.title}
                </h3>
                <div className="space-y-4">
                  {solutions.prospect.items.map((item, index) => (
                    <div key={index} className={`p-4 rounded-lg ${item.bgColor}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          <span className={`font-medium ${item.color}`}>{item.title}</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-medium ${item.color}`}>{item.tag}</span>
                          <div className="flex items-center gap-1 mt-1">
                            <ArrowRight className={`w-3 h-3 ${item.color}`} />
                            <span className="text-xs text-gray-400">{item.tagDetail}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <div className="h-full flex flex-col">
                  <h4 className="text-lg font-medium text-white mb-4">Available Reports</h4>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="text-white">Market Analysis Report</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                          <FileDownload className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                      <p className="text-sm text-gray-400">Comprehensive local market insights and trends</p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-400" />
                          <span className="text-white">Firm Performance Report</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                          <FileDownload className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                      <p className="text-sm text-gray-400">Detailed metrics on local accounting firms</p>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-yellow-400" />
                          <span className="text-white">Growth Opportunities Report</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300">
                          <FileDownload className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                      <p className="text-sm text-gray-400">Analysis of high-potential acquisition targets</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};