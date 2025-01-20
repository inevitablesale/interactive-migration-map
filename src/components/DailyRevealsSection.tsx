import { Clock, Users } from "lucide-react";
import { Card } from "./ui/card";

export const DailyRevealsSection = () => {
  return (
    <div className="min-h-screen bg-black/95 relative z-20 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
            DAILY FIRM REVEALS AT 9 AM EST
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto mb-12">
            Every morning at 9 AM EST, we go live on LinkedIn to reveal a carefully curated accounting firm positioned for acquisition. Don't miss the opportunity to hear about each firm's strengths and why it stands out.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 bg-black/40 backdrop-blur-md border-white/10">
              <div className="flex flex-col items-center text-center">
                <Clock className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-4">Members Get Early Access at 6 AM</h3>
                <p className="text-gray-400">
                  Can't wait for the reveal? As a member, you'll receive the daily listing in your inbox at 6 AM EST—3 hours before it goes public. Review the firm's details early and decide if it's the right fit for your acquisition goals.
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-black/40 backdrop-blur-md border-white/10">
              <div className="flex flex-col items-center text-center">
                <Users className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-4">Public LinkedIn Reveal</h3>
                <p className="text-gray-400">
                  Join our daily LinkedIn live sessions at 9 AM EST for detailed insights into each featured firm. Get expert analysis and understand what makes each opportunity unique.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};