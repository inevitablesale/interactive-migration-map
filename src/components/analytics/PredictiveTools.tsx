import { useState } from "react";
import { TrendingUp, Shield, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function PredictiveTools() {
  const { toast } = useToast();
  
  const handlePremiumFeature = () => {
    toast({
      title: "Premium Feature",
      description: "Upgrade to access predictive analytics tools",
    });
  };

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Predictive Analytics</h3>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white/5 p-4 rounded">
          <Shield className="w-4 h-4 text-yellow-400 mb-2" />
          <h4 className="text-sm font-medium text-white mb-2">Growth Potential</h4>
          <p className="text-xs text-white/60 mb-4">Forecast revenue and employee growth</p>
          <Button 
            onClick={handlePremiumFeature}
            className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
          >
            Analyze Growth
          </Button>
        </div>

        <div className="bg-white/5 p-4 rounded">
          <Target className="w-4 h-4 text-yellow-400 mb-2" />
          <h4 className="text-sm font-medium text-white mb-2">Retention Risk</h4>
          <p className="text-xs text-white/60 mb-4">Evaluate client and staff retention risks</p>
          <Button 
            onClick={handlePremiumFeature}
            className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
          >
            View Risks
          </Button>
        </div>

        <div className="bg-white/5 p-4 rounded">
          <TrendingUp className="w-4 h-4 text-yellow-400 mb-2" />
          <h4 className="text-sm font-medium text-white mb-2">Market Saturation</h4>
          <p className="text-xs text-white/60 mb-4">Identify over/under-served markets</p>
          <Button 
            onClick={handlePremiumFeature}
            className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
          >
            Analyze Market
          </Button>
        </div>
      </div>
    </Card>
  );
}