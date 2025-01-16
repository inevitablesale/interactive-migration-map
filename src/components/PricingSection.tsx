import { ArrowRight } from "lucide-react";
import { Card } from "./ui/card";

export const PricingSection = () => {
  return (
    <div className="py-20 px-4 relative z-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the plan that best fits your needs and start discovering opportunities today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/90 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Strategic Scout</h3>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-400/10 text-yellow-600 rounded">
                $49/month
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Essential tools for market exploration
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                Basic market insights
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                Manual state and county level browsing
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                State and national rankings across 25 data points
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                Weekly insights newsletter
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Executive Advantage</h3>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-400/10 text-yellow-600 rounded">
                $99/month
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-green-400/10 text-green-600 rounded ml-2">
                Launch Price
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Complete suite for serious buyers
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                Detailed county-level insights
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                Access to off-market firm listings
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                State comparison tool
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                Canary Deal Sourcer
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                Downloadable reports
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};