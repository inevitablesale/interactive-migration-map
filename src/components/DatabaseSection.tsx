import { Card } from "./ui/card";
import { Check } from "lucide-react";

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
    "Firm-Level Insights: Employee size, service mix, and operational details",
    "Census-Based Market Trends: Competitive density, economic growth, and regional demand",
    "Location-Specific Data: Explore firms by state, county, and metropolitan areas"
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
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-400 mt-1 shrink-0" />
                  <p className="text-gray-400">{insight}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};