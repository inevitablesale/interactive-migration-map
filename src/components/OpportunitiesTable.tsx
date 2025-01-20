import { Card } from "./ui/card";
import { Building2, MapPin, Users, PieChart, Sparkles } from "lucide-react";

export const OpportunitiesTable = () => {
  const opportunities = [
    {
      category: "Succession-Ready Firms",
      firms: [
        {
          industry: "Accounting Firm",
          region: "Midwest",
          employeeCount: "10",
          serviceMix: "80% Tax, 20% Advisory",
          highlights: "Succession-ready owner"
        },
        {
          industry: "Architectural Firm",
          region: "Southeast",
          employeeCount: "7",
          serviceMix: "100% Architecture",
          highlights: "Strong project portfolio"
        }
      ]
    },
    {
      category: "High-Growth Segments",
      firms: [
        {
          industry: "IT Consulting Firm",
          region: "West Coast",
          employeeCount: "5",
          serviceMix: "90% Remote IT Support",
          highlights: "Fully remote operation"
        },
        {
          industry: "Engineering Firm",
          region: "Northeast",
          employeeCount: "15",
          serviceMix: "60% Structural, 40% Civil",
          highlights: "Growing client base"
        }
      ]
    },
    {
      category: "Underserved Markets",
      firms: [
        {
          industry: "Advertising Firm",
          region: "South",
          employeeCount: "8",
          serviceMix: "70% Digital, 30% Branding",
          highlights: "Market leader potential"
        },
        {
          industry: "Accounting Firm",
          region: "Northwest",
          employeeCount: "12",
          serviceMix: "50% Tax, 50% Bookkeeping",
          highlights: "Established client base"
        }
      ]
    },
    {
      category: "Markets with Low Staffing Costs",
      firms: [
        {
          industry: "Accounting Firm",
          region: "Midwest",
          employeeCount: "6",
          serviceMix: "60% Bookkeeping, 40% Advisory",
          highlights: "Efficient operations"
        },
        {
          industry: "Engineering Firm",
          region: "South-Central",
          employeeCount: "20",
          serviceMix: "70% Civil, 30% Environmental",
          highlights: "Strong local presence"
        }
      ]
    }
  ];

  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Explore Real Opportunities with Canary
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {opportunities.map((category, idx) => (
            <Card key={idx} className="overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100">
                <h3 className="text-xl font-semibold text-primary mb-6">{category.category}</h3>
                <div className="space-y-6">
                  {category.firms.map((firm, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className="w-5 h-5 text-blue-500" />
                        <h4 className="font-medium text-gray-900">{firm.industry}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{firm.region}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{firm.employeeCount} employees</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <PieChart className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{firm.serviceMix}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Sparkles className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-600">{firm.highlights}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};