import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const UpgradePrompt = () => {
  return (
    <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-white/10 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Unlock Premium Features</h3>
      </div>

      <p className="text-sm text-blue-100/80 mb-6">
        Get access to detailed firm profiles, predictive analytics, and more for just $250/month
      </p>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          <span className="text-sm text-white">Detailed firm profiles</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          <span className="text-sm text-white">Predictive analytics</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          <span className="text-sm text-white">Advanced filtering</span>
        </div>
      </div>

      <Button className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600">
        Upgrade Now
      </Button>

      <p className="text-xs text-center text-blue-100/60 mt-4">
        Join 50+ buyers who've upgraded this month!
      </p>
    </Card>
  );
};