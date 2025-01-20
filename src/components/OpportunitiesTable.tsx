import { Card } from "./ui/card";

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
    }
  ];

  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Explore Real Opportunities with Canary
        </h2>
        <div className="space-y-8">
          {opportunities.map((category, idx) => (
            <Card key={idx} className="p-6 bg-white/90 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="p-2">Industry</th>
                      <th className="p-2">Region</th>
                      <th className="p-2">Employee Count</th>
                      <th className="p-2">Service Mix</th>
                      <th className="p-2">Strategic Highlights</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.firms.map((firm, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="p-2">{firm.industry}</td>
                        <td className="p-2">{firm.region}</td>
                        <td className="p-2">{firm.employeeCount}</td>
                        <td className="p-2">{firm.serviceMix}</td>
                        <td className="p-2">{firm.highlights}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};