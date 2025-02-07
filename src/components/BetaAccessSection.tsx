import { Sparkles, ArrowRight, Linkedin } from "lucide-react";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";

export const BetaAccessSection = () => {
  const navigate = useNavigate();

  const handleLinkedInSignup = () => {
    navigate('/auth');
  };

  return (
    <div className="py-20 px-4">
      <Card className="max-w-4xl mx-auto p-12 bg-white/90 backdrop-blur-sm">
        <div className="text-center">
          <div className="mb-6">
            <Sparkles className="w-12 h-12 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Join Our Beta Launch</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Be among the first to access Canary, a platform designed to make professional service firm acquisitions smarter and easier. By combining data insights with managed outreach, Canary identifies opportunities you won't find anywhere else.
          </p>
          <div className="grid md:grid-cols-4 gap-6 mb-8 text-left">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="min-h-[3rem] flex items-center">
                <h3 className="font-semibold text-gray-900">Off-Market Intelligence</h3>
              </div>
              <p className="text-sm text-gray-600 mt-2">We surface firms that aren't publicly listed for sale, identified through predictive modeling.</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="min-h-[3rem] flex items-center">
                <h3 className="font-semibold text-gray-900">Daily Picks</h3>
              </div>
              <p className="text-sm text-gray-600 mt-2">Every day, Canary features one carefully selected firm positioned for acquisition.</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="min-h-[3rem] flex items-center">
                <h3 className="font-semibold text-gray-900">Managed Outreach</h3>
              </div>
              <p className="text-sm text-gray-600 mt-2">We handle all communication with firm owners, ensuring professional engagement.</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="min-h-[3rem] flex items-center">
                <h3 className="font-semibold text-gray-900">Risk-Free Model</h3>
              </div>
              <p className="text-sm text-gray-600 mt-2">Access is free—Canary earns a 2.5% success fee only when you close a deal.</p>
            </div>
          </div>
          <button 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors mx-auto"
            onClick={handleLinkedInSignup}
          >
            <Linkedin className="w-5 h-5" />
            <span>Sign Up with LinkedIn</span>
          </button>
        </div>
      </Card>
    </div>
  );
};