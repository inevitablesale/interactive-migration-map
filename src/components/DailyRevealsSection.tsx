import { Clock, Users, ArrowRight } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export const DailyRevealsSection = () => {
  return (
    <div className="min-h-screen bg-black/95 relative z-20 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
            DAILY FIRM REVEALS AT 9 AM EST
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto mb-12">
            Every morning at 9 AM EST, we go live on LinkedIn to reveal key metrics and insights about a carefully curated professional services firm positioned for acquisition. To protect confidentiality, firm names remain anonymized until mutual interest is established. These off-market opportunities are surfaced using advanced analytics and expert curation.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 bg-black/40 backdrop-blur-md border-white/10">
              <div className="flex flex-col items-center text-center">
                <Clock className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-4">Members Get Early Access at 6 AM</h3>
                <ul className="text-gray-400 space-y-4">
                  <li>Receive the daily listing 3 hours early, directly in your inbox.</li>
                  <li>Review key metrics like service mix, employee count, and operational stability before the public reveal.</li>
                  <li>Get a head start on opportunities before others even see them.</li>
                </ul>
              </div>
            </Card>

            <Card className="p-8 bg-black/40 backdrop-blur-md border-white/10">
              <div className="flex flex-col items-center text-center">
                <Users className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-4">How Canary Works</h3>
                <ul className="text-gray-400 space-y-4">
                  <li>1. Sign up for free access to daily listings</li>
                  <li>2. Explore opportunities backed by data signals</li>
                  <li>3. Express interest and we handle outreach</li>
                  <li>4. Close deals with our support</li>
                </ul>
              </div>
            </Card>
          </div>

          <Button 
            className="mt-8 bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <span>Sign Up for Free Now</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};