import { Database, Globe, Info, Server, Brain, LineChart, ShieldCheck, ArrowRight } from "lucide-react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";

export const DataSourcesSection = () => {
  const [activeTab, setActiveTab] = useState("transform");

  const transformations = {
    collect: {
      title: "Data Collection",
      description: "Comprehensive data gathering from authoritative sources",
      steps: [
        "Census Bureau demographic data",
        "Bureau of Labor Statistics employment metrics",
        "County Business Patterns statistics"
      ]
    },
    analyze: {
      title: "Smart Analysis",
      description: "Advanced analytics to extract meaningful insights",
      steps: [
        "Market penetration metrics",
        "Growth potential indicators",
        "Competitive landscape analysis"
      ]
    },
    decide: {
      title: "Decision Support",
      description: "Turn insights into actionable strategies",
      steps: [
        "Opportunity scoring",
        "Risk assessment metrics",
        "Investment case builder"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-black/95 relative z-20 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
            How Canary Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Transforming complex market data into clear, actionable acquisition strategies
          </p>
        </div>

        <Tabs defaultValue="transform" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto mb-8">
            <TabsTrigger value="transform">Data Journey</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="transform" className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(transformations).map(([key, transform]) => (
                <Card key={key} className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    {key === "collect" && <Database className="w-5 h-5 text-yellow-400" />}
                    {key === "analyze" && <Brain className="w-5 h-5 text-yellow-400" />}
                    {key === "decide" && <LineChart className="w-5 h-5 text-yellow-400" />}
                    <h3 className="text-lg font-semibold text-white">{transform.title}</h3>
                  </div>
                  <p className="text-gray-300 mb-4">{transform.description}</p>
                  <ul className="space-y-3">
                    {transform.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Geographic Coverage</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                    State-level economic indicators
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                    MSA (Metropolitan Statistical Area) analysis
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                    County-level demographic insights
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Data Quality</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                    Real-time data aggregation
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                    Advanced filtering options
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                    Predictive analytics
                  </li>
                </ul>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-white">Strategic Scout</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-400/10 text-yellow-400 rounded">
                    $50/month
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Essential tools for market exploration
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                    Access to anonymized data
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                    Basic MSA-level heatmaps
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                    Weekly insights newsletter
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-white">Executive Advantage</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-400/10 text-yellow-400 rounded">
                    $99/month
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Complete suite for serious buyers
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                    Detailed city-level insights
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                    Access to firm listings
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                    Canary Deal Sourcer
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                    Downloadable reports
                  </li>
                </ul>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};