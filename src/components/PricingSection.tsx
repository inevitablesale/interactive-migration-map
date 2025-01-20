import { ArrowRight, Check } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export const PricingSection = () => {
  return (
    <div className="py-20 px-4 relative z-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
            Simple, Risk-Free Pricing
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover off-market opportunities with no upfront costs. Pay only when you close the deal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/90 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Free Access for Serious Buyers</h3>
            </div>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                <span>Daily Curated Listings: Receive one exclusive firm listing every morning at 6 AM EST, complete with actionable insights.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                <span>Searchable Database: Explore a growing collection of 2,300 anonymized firms, filtered by region, service mix, and firm size.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                <span>Managed Outreach: Let Canary handle seller engagement professionally and securely.</span>
              </li>
            </ul>

            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">How We Protect Privacy</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                  <span>Anonymized Listings: Sellers remain unidentified until they agree to engage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                  <span>NDAs: Non-disclosure agreements are facilitated to protect both parties before sensitive details are shared.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                  <span>Centralized Outreach: Canary ensures a professional and streamlined communication process, so sellers aren't overwhelmed with requests.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Success Fee</h3>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-400/10 text-yellow-600 rounded">
                2.5% of Purchase Price
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-green-400/10 text-green-600 rounded">
                Pay Only When You Close
              </span>
            </div>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                No subscription fees.
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                No upfront costs.
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-yellow-600 mt-1 shrink-0" />
                Only pay when you finalize an acquisition.
              </li>
            </ul>

            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Discover Your Next Acquisition?</h3>
              <p className="text-gray-600 mb-6">Don't wait for opportunities to go public. With Canary, you gain access to off-market firms and actionable insights to help you close deals faster.</p>
              <div className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Sign Up for Free Today
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" className="w-full">
                  Join Our Daily LinkedIn Live
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};