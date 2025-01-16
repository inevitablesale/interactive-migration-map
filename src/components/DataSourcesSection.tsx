import { Database, Globe, Server, Brain, LineChart, ShieldCheck, ArrowRight } from "lucide-react";
import { Card } from "./ui/card";

export const DataSourcesSection = () => {
  const transformations = {
    collect: {
      title: "Data Collection",
      description: "Comprehensive data gathering from authoritative sources",
      steps: [
        "Census Bureau demographic data",
        "Bureau of Labor Statistics employment metrics",
        "County Business Patterns statistics",
        "LinkedIn business data points"
      ]
    },
    analyze: {
      title: "Smart Analysis",
      description: "Data-driven market intelligence and opportunity scoring",
      steps: [
        "Market density and saturation analysis",
        "Growth rate and migration trends",
        "Education and talent metrics",
        "Economic health indicators"
      ]
    },
    decide: {
      title: "Decision Support",
      description: "Strategic insights for market entry and expansion",
      steps: [
        "Market opportunity scoring",
        "Competitive landscape mapping",
        "Regional performance benchmarking",
        "500 new firms added monthly"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-black/95 relative z-20 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
            Turning Market Data Into Deal Flow
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tracking over 2,000 accounting firms with 500+ new opportunities added monthly. We help buyers discover their perfect acquisition matches before they ever hit the market.
          </p>
        </div>

        <div className="space-y-8">
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
                  County-level market analysis
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                  State-by-state comparison metrics
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                  Metropolitan Statistical Area (MSA) insights
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
                  Comprehensive firm profiling
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                  Market trend validation
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                  Growth projection modeling
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};