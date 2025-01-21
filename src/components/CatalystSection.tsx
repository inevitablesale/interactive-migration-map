import { Card } from "./ui/card";
import { TrendingUp, Users, Lock } from "lucide-react";

export const CatalystSection = () => {
  const benefits = [
    {
      icon: Users,
      title: "Aggregating Buyer Interest",
      description: "Consolidating demand into a single, clear signal, demonstrating to firm owners that the market is ready—without overwhelming them."
    },
    {
      icon: TrendingUp,
      title: "Identifying Opportunities",
      description: "Leveraging data to surface firms with strong acquisition potential, such as owners nearing retirement, scalable models, and stable growth."
    },
    {
      icon: Lock,
      title: "Securing Privacy",
      description: "Ensuring identities remain protected until owners actively engage, maintaining trust and control throughout the process."
    }
  ];

  return (
    <div className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">The Catalyst for Firm Transitions</h2>
        
        <p className="text-lg text-gray-600 text-center mb-8 max-w-3xl mx-auto">
          According to the Exit Planning Institute, 80–90% of a business owner's wealth is tied up in their business, and 78% of small business owners plan to sell their businesses to fund more than 60% of their retirement.
        </p>
        
        <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Despite this, many firm owners hesitate to take the leap due to uncertainty and lack of preparation.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col items-center text-center">
                <benefit.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <p className="text-xl text-center font-semibold text-gray-800 italic">
          "Canary doesn't just connect buyers and firms—it accelerates decisions and creates opportunities that wouldn't otherwise exist."
        </p>
      </div>
    </div>
  );
};