import { Card } from "./ui/card";
import { TrendingUp, Shield, Globe } from "lucide-react";

export const WhyProfessionalServices = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Stable Revenue & Resilience",
      description: "Services like tax preparation, IT support, and consulting retainers provide reliable, recurring revenue streams."
    },
    {
      icon: Shield,
      title: "Fragmented Market, Scalable Growth",
      description: "The professional services market offers ample consolidation opportunities for buyers seeking scale."
    },
    {
      icon: Globe,
      title: "Remote-Friendly Models",
      description: "Firms with digital-first operations are ideal for modern buyers aiming for scalability without geographic limits."
    }
  ];

  return (
    <div className="py-20 px-4 bg-black/95">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
          Why Professional Services Are Ideal for Acquisition
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="p-6 bg-black/40 backdrop-blur-md border-white/10">
              <div className="flex flex-col items-center text-center">
                <benefit.icon className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};