import { Building2, MapPin } from "lucide-react";
import { Card } from "./ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const DataSourcesSection = () => {
  const { data: metricsData } = useQuery({
    queryKey: ['trackingMetrics'],
    queryFn: async () => {
      const { count: firmsCount } = await supabase
        .from('canary_firms_data')
        .select('*', { count: 'exact', head: true });

      const { count: citiesCount } = await supabase
        .from('county_data')
        .select('*', { count: 'exact', head: true });

      return {
        firms: firmsCount || 0,
        cities: citiesCount || 0,
      };
    }
  });

  const metrics = [
    {
      title: "Firms Tracked",
      value: "872",
      icon: Building2,
      color: "text-blue-400"
    },
    {
      title: "Cities Covered",
      value: "493",
      icon: MapPin,
      color: "text-green-400"
    }
  ];

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
        "Growth potential analysis"
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
            Tracking {metricsData?.firms.toLocaleString()} firms across {metricsData?.cities.toLocaleString()} cities. Canary helps buyers discover their perfect acquisition matches before they ever hit the market.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-6 bg-black/40 backdrop-blur-md border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                <h3 className="text-lg font-semibold text-white">{metric.title}</h3>
              </div>
              <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
            </Card>
          ))}
        </div>

        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(transformations).map(([key, transform]) => (
              <Card key={key} className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  {key === "collect" && <Building2 className="w-5 h-5 text-yellow-400" />}
                  {key === "analyze" && <Building2 className="w-5 h-5 text-yellow-400" />}
                  {key === "decide" && <Building2 className="w-5 h-5 text-yellow-400" />}
                  <h3 className="text-lg font-semibold text-white">{transform.title}</h3>
                </div>
                <p className="text-gray-300 mb-4">{transform.description}</p>
                <ul className="space-y-3">
                  {transform.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <Building2 className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
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
                <Building2 className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Geographic Coverage</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                  County-level market analysis
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                  State-by-state comparison metrics
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                  Metropolitan Statistical Area (MSA) insights
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Data Quality</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                  Comprehensive firm profiling
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                  Market trend validation
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
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
