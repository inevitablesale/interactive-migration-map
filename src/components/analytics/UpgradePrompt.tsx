import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UpgradePromptProps {
  title: string;
  description: string;
  features: string[];
}

export const UpgradePrompt = ({ 
  title = "Unlock Advanced Features",
  description = "Get access to detailed firm profiles, predictive analytics, and more for just $250/month",
  features = [
    "Detailed firm listings and profiles",
    "Custom alerts for market opportunities",
    "Advanced growth strategy analytics",
    "Predictive market insights"
  ]
}: UpgradePromptProps) => {
  return (
    <Card className="bg-gradient-to-br from-[#E5DEFF] to-[#F1F0FB] border-white/10 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        {description}
      </p>

      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      <Button className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600">
        Upgrade Now
      </Button>

      <p className="text-xs text-center text-gray-500 mt-4">
        Join 50+ buyers who've upgraded this month!
      </p>
    </Card>
  );
};