import { Brain, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const FeaturedInsights = () => {
  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Featured Insights</h2>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-2">
            Top 3 Regions for Growth Potential
          </h3>
          <p className="text-sm text-blue-100/60 mb-4">
            Based on population growth, business formation, and economic indicators
          </p>
          <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0">
            View Details <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-2">
            Counties with Highest Firm Density
          </h3>
          <p className="text-sm text-blue-100/60 mb-4">
            Analysis of accounting firms per 10,000 residents
          </p>
          <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0">
            View Details <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="bg-white/5 p-4 rounded-lg opacity-50">
          <h3 className="text-sm font-medium text-white mb-2">
            High-Potential Acquisition-Ready Firms
          </h3>
          <p className="text-sm text-blue-100/60 mb-4">
            Unlock detailed insights and firm profiles
          </p>
          <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0">
            Upgrade to Access <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
};