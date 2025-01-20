import { Card } from "./ui/card";
import { ClipboardList, Search, MessageSquare, Shield, Users, CheckCircle } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: ClipboardList,
      title: "Sign Up for Free",
      description: "Gain access to daily curated picks and our searchable database."
    },
    {
      icon: Search,
      title: "Explore Data-Driven Insights",
      description: "Evaluate firms based on service mix, employee size, market trends, and more."
    },
    {
      icon: MessageSquare,
      title: "Express Interest",
      description: "Found a firm that fits your strategy? Let us know, and we'll handle the outreach."
    },
    {
      icon: Shield,
      title: "Trust the Process",
      description: "NDAs and success fee agreements ensure transparency before direct engagement."
    },
    {
      icon: Users,
      title: "Make the Connection",
      description: "When the firm owner expresses interest, we connect you directly to move forward."
    },
    {
      icon: CheckCircle,
      title: "Close the Deal",
      description: "Complete the acquisition with our support, paying only when the deal closes."
    }
  ];

  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">How Canary Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="p-6 bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-all duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};