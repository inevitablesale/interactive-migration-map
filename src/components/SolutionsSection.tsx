import { ArrowRight, Brain, LineChart, ShieldCheck, Users, Target, TrendingUp, DollarSign } from "lucide-react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AIDealSourcer } from "./analytics/AIDealSourcer";
import { useNavigate } from "react-router-dom";
import { AccountingIndustryCard } from "./market-report/AccountingIndustryCard";
import { getStateName } from "@/utils/stateUtils";

  const solutions = {
    analyze: {
      title: "Comprehensive Market Analysis",
      description: "Unlock hidden opportunities by combining census data, public deal analytics, and proprietary off-market insights",
      metrics: [
        {
          title: "Deal Flow Intelligence",
          value: "Real-time",
          icon: Brain,
          description: "AI-powered market matching",
          trend: "Predictive analytics",
          color: "bg-blue-500/10 text-blue-500"
        },
        {
          title: "Market Validation",
          value: "3-Layer",
          icon: Target,
          description: "Census + Deals + Off-Market",
          trend: "Cross-validated",
          color: "bg-amber-500/10 text-amber-500"
        },
        {
          title: "Opportunity Discovery",
          value: "Pre-Market",
          icon: TrendingUp,
          description: "Early access to emerging deals",
          trend: "Ahead of competition",
          color: "bg-green-500/10 text-green-500"
        }
      ]
    },
    assess: {
      title: "Strategic Market Entry",
      description: "Make confident decisions with multi-layered market intelligence",
      metrics: [
        {
          title: "Risk Assessment",
          value: "Multi-Factor",
          icon: ShieldCheck,
          description: "Comprehensive risk analysis",
          trend: "Dynamic updates",
          color: "bg-purple-500/10 text-purple-500"
        },
        {
          title: "Value Analysis",
          value: "360°",
          icon: DollarSign,
          description: "Complete market perspective",
          trend: "Full coverage",
          color: "bg-pink-500/10 text-pink-500"
        },
        {
          title: "Competitive Edge",
          value: "Early",
          icon: Users,
          description: "First-mover advantage",
          trend: "Market leadership",
          color: "bg-orange-500/10 text-orange-500"
        }
      ]
    },
    plan: {
      title: "Market Entry Strategy",
      description: "Make data-driven decisions with comprehensive market intelligence",
      metrics: [
        {
          title: "Market Validation",
          value: "Multi-Level",
          icon: Target,
          description: "National & State-County Rankings",
          trend: "Comprehensive analysis",
          color: "bg-teal-500/10 text-teal-500"
        },
        {
          title: "Growth Analysis",
          value: "Predictive",
          icon: TrendingUp,
          description: "Future market potential",
          trend: "Forward-looking",
          color: "bg-indigo-500/10 text-indigo-500"
        },
        {
          title: "Opportunity Score",
          value: "Dynamic",
          icon: LineChart,
          description: "Market attractiveness rating",
          trend: "Data-driven insights",
          color: "bg-rose-500/10 text-rose-500"
        }
      ]
    }
  };

export const SolutionsSection = () => {
  const [activeTab, setActiveTab] = useState("analyze");
  const navigate = useNavigate();

  const { data: marketData } = useQuery({
    queryKey: ['marketMetrics'],
    queryFn: async () => {
      const { data: stateData, error } = await supabase
        .from('state_data')
        .select('STATEFP, EMP, PAYANN, ESTAB, B01001_001E')
        .order('ESTAB', { ascending: false })
        .limit(10);
      
      if (error) throw error;

      // Transform the data with state names and calculate market density
      const transformedData = await Promise.all(stateData?.map(async state => {
        const stateName = await getStateName(state.STATEFP);
        const marketDensity = state.B01001_001E ? (state.ESTAB / state.B01001_001E) * 10000 : 0;
        return {
          name: stateName,
          marketDensity: Math.round(marketDensity * 100) / 100,
          statefp: state.STATEFP
        };
      }) || []);

      return transformedData;
    }
  });

  // Query for accounting industry metrics
  const { data: accountingMetrics } = useQuery({
    queryKey: ['accountingMetrics'],
    queryFn: async () => {
      const { data: countyData, error } = await supabase
        .from('county_data')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      if (!countyData) return null;

      return {
        total_establishments: countyData.ESTAB || 0,
        emp: countyData.EMP || 0,
        payann: countyData.PAYANN || 0,
        firms_per_10k_population: countyData.B01001_001E ? (countyData.ESTAB / countyData.B01001_001E) * 10000 : 0,
        total_population: countyData.B01001_001E || 0,
        median_household_income: countyData.B19013_001E || 0,
        median_gross_rent: countyData.B25064_001E || 0,
        median_home_value: countyData.B25077_001E || 0,
        total_housing_units: countyData.B25001_001E || 0,
        occupied_housing_units: countyData.B25002_002E || 0,
        vacant_housing_units: countyData.B25002_003E || 0,
        total_employed: countyData.B23025_004E || 0,
        total_unemployed: countyData.B23025_005E || 0,
        employed_population: countyData.B23025_004E || 0,
        private_sector_accountants: countyData.C24010_033E || 0,
        public_sector_accountants: countyData.C24010_034E || 0,
        total_households: countyData.B11001_001E || 0,
        family_households: countyData.B11003_001E || 0,
        total_education_population: countyData.B15003_001E || 0,
        bachelors_degree_holders: countyData.B15003_022E || 0,
        masters_degree_holders: countyData.B15003_023E || 0,
        doctorate_degree_holders: countyData.B15003_025E || 0,
        growth_rate_percentage: 0,
        market_saturation_index: 0,
        avgSalaryPerEmployee: countyData.PAYANN && countyData.EMP ? countyData.PAYANN / countyData.EMP : 0,
        vacancy_rate: countyData.B25001_001E ? (countyData.B25002_003E / countyData.B25001_001E) * 100 : 0,
        vacancy_rank: 0,
        income_rank: 0,
        population_rank: 0,
        rent_rank: 0,
        growth_rank: 0,
        top_firms: []
      };
    }
  });

  const handleStateClick = (statefp: string) => {
    if (statefp) {
      navigate(`/state-market-report/${statefp}`);
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
                    <h3 className="text-lg font-semibold text-white">
                      {key === "plan" ? "Prospect with Confidence" : solution.title}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {solution.metrics.map((metric, index) => (
                      <div 
                        key={index} 
                        className={`${metric.color} p-4 rounded-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <metric.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{metric.title}</span>
                          </div>
                          <span className="text-lg font-semibold animate-fade-in">{metric.value}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs opacity-80">{metric.description}</p>
                          <div className="flex items-center gap-1">
                            <ArrowRight className="w-3 h-3" />
                            <span className="text-xs font-medium">{metric.trend}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10 overflow-hidden">
                  {key === "analyze" && (
                    <div className="h-full animate-fade-in">
                      <AIDealSourcer embedded={true} />
                    </div>
                  )}
                  {key === "assess" && accountingMetrics && (
                    <div className="h-full animate-fade-in">
                      <AccountingIndustryCard marketData={accountingMetrics} />
                    </div>
                  )}
                  {key === "plan" && (
                    <div className="h-full flex flex-col animate-fade-in">
                      <h4 className="text-sm font-medium text-gray-300 mb-4">Market Density Overview</h4>
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
                                dataKey="marketDensity"
                                name="Market Density (per 10k population)"
                                fill="#EAB308"
                                radius={[4, 4, 0, 0]}
                                onClick={(data) => handleStateClick(data.statefp)}
                                style={{ cursor: 'pointer' }}
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
