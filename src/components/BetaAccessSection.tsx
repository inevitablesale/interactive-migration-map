import { Sparkles, ArrowRight } from "lucide-react";
import { Card } from "./ui/card";

export const BetaAccessSection = () => {
  return (
    <div className="py-20 px-4">
      <Card className="max-w-4xl mx-auto p-12 bg-white/90 backdrop-blur-sm">
        <div className="text-center">
          <div className="mb-6">
            <Sparkles className="w-12 h-12 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Join Our Beta Launch</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Get exclusive early access to the first data-driven market intelligence platform for accounting firm acquisitions. Our platform helps serious buyers identify and evaluate opportunities using comprehensive market analysis, demographic insights, and growth metrics.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900">Market Analysis</h3>
              <p className="text-sm text-gray-600">Access detailed insights across 493 regions and 2,297 firms to identify prime acquisition targets.</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900">Growth Metrics</h3>
              <p className="text-sm text-gray-600">Evaluate opportunities using comprehensive data on market saturation, growth rates, and economic indicators.</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900">Early Access</h3>
              <p className="text-sm text-gray-600">Be among the first to discover and evaluate opportunities before they hit the open market.</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              disabled
            >
              <span>Sign Up with LinkedIn</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-sm text-gray-500">Coming Soon</p>
          </div>
        </div>
      </Card>
    </div>
  );
};