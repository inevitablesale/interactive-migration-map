import { Card } from "./ui/card";
import { Check, Users, LineChart, MapPin, Building2, Brain, Database, Search } from "lucide-react";

export const DatabaseSection = () => {
  const industries = [
    {
      type: "Accounting Firms",
      specialties: "Tax-heavy, audit-focused, or diversified practices"
    },
    {
      type: "Law Firms",
      specialties: "Estate planning, corporate law, and litigation"
    },
    {
      type: "Consulting Firms",
      specialties: "Management, IT, and strategy consultancies"
    },
    {
      type: "Architectural Firms",
      specialties: "Residential and commercial design specialists"
    },
    {
      type: "Engineering Firms",
      specialties: "Civil, structural, and mechanical practices"
    },
    {
      type: "Advertising Agencies",
      specialties: "Digital media, creative, and branding experts"
    }
  ];

  const insights = [
    {
      icon: Building2,
      title: "Firm-Level Insights",
      details: [
        "Employee count and growth trends",
        "Service mix and specializations",
        "Revenue per employee metrics",
        "Operational efficiency indicators",
        "Client portfolio analysis"
      ]
    },
    {
      icon: LineChart,
      title: "Market Trend Analysis",
      details: [
        "Competitive density mapping",
        "Regional economic indicators",
        "Industry growth patterns",
        "Market saturation metrics",
        "Demand forecasting"
      ]
    }
  ];

  return (
    <div className="py-20 px-4 bg-black/95">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
            A Database Built for Decision-Makers
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6">Who's Included?</h3>
            <div className="space-y-4">
              {industries.map((industry, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-white font-medium">{industry.type}</p>
                    <p className="text-gray-400 text-sm">{industry.specialties}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6">What You'll Discover</h3>
            <div className="space-y-6">
              {insights.map((insight, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <insight.icon className="w-5 h-5 text-yellow-400" />
                    <h4 className="text-white font-medium">{insight.title}</h4>
                  </div>
                  <ul className="space-y-2">
                    {insight.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-400 text-sm">
                        <Check className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};