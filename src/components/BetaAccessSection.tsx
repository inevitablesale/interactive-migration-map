import { Beta, ArrowRight } from "lucide-react";
import { Card } from "./ui/card";

export const BetaAccessSection = () => {
  return (
    <div className="py-20 px-4 relative z-20">
      <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <Beta className="w-12 h-12 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Join Our Beta Program</h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            Get early access to our market intelligence platform. Connect with your LinkedIn account to start discovering opportunities ahead of the curve.
          </p>
          <div className="flex items-center gap-4">
            <button 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              disabled
            >
              <span>Connect with LinkedIn</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-sm text-gray-500">Coming Soon</p>
          </div>
        </div>
      </Card>
    </div>
  );
};