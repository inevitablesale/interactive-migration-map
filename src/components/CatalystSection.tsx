import { Card } from "./ui/card";
import { TrendingUp, Users, Lock, Search } from "lucide-react";

export const CatalystSection = () => {
  const benefits = [
    {
      icon: Search,
      title: "Access Hidden Opportunities",
      description: "Gain insights into firms that would otherwise remain invisible—retiring owners, firms with scalable teams, or operations in underserved markets."
    },
    {
      icon: TrendingUp,
      title: "Data-Driven Confidence",
      description: "Each firm is surfaced using advanced analytics, providing detailed metrics on service mix, employee count, market positioning, and growth signals to help you make informed decisions."
    },
    {
      icon: Users,
      title: "Professional and Streamlined Process",
      description: "Skip the cold outreach and fragmented searches—Canary consolidates interest into a single, professional inquiry, giving you a clear path to connection."
    },
    {
      icon: Lock,
      title: "Save Time and Focus on What Matters",
      description: "With our managed outreach and curated insights, you spend less time hunting for deals and more time securing the right ones."
    }
  ];

  return (
    <div className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Making Off-Market Acquisitions Possible</h2>
        
        <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          For buyers, finding the right firm often feels like a waiting game—but what if the best opportunities never make it to the market? Canary flips the script, connecting you with high-potential firms that aren't publicly listed for sale and creating new possibilities for strategic acquisitions.
        </p>

        <h3 className="text-2xl font-semibold mb-8 text-center">How This Benefits Buyers</h3>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
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
          "Canary isn't just a platform—it's the missing piece in off-market acquisitions, bridging the gap between buyers and hidden opportunities."
        </p>
      </div>
    </div>
  );
};