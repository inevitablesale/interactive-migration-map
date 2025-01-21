import { Card } from "./ui/card";
import { TrendingUp, Users, Lock } from "lucide-react";

export const CatalystSection = () => {
  const benefits = [
    {
      icon: Users,
      title: "Crowdsourced Buyer Interest",
      description: "One consolidated inquiry demonstrates demand without overwhelming firm owners."
    },
    {
      icon: TrendingUp,
      title: "Data-Driven Discovery",
      description: "Advanced analytics surface firms with clear acquisition signals: retiring owners, scalable operations, and untapped markets."
    },
    {
      icon: Lock,
      title: "Trust and Privacy",
      description: "Identities remain anonymous until the owner chooses to engage, ensuring a professional and secure process."
    }
  ];

  return (
    <div className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Making Off-Market Acquisitions Possible</h2>
        
        <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          For buyers searching for hidden opportunities and firm owners hesitating to take the next step, Canary creates a marketplace where none existed—connecting serious buyers with high-potential firms not publicly listed for sale.
        </p>

        <h3 className="text-2xl font-semibold mb-8 text-center">How Canary Changes the Game</h3>

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
          "Canary isn't just a platform—it's the missing piece in off-market acquisitions, bridging the gap between buyers and hidden opportunities."
        </p>
      </div>
    </div>
  );
};