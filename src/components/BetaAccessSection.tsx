import { Sparkles, ArrowRight } from "lucide-react";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const BetaAccessSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLinkedInSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/thank-you`,
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: error.message,
        });
      }
    } catch (error) {
      console.error('LinkedIn auth error:', error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Failed to connect with LinkedIn. Please try again.",
      });
    }
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
              <h3 className="font-semibold mb-2 text-gray-900">Off-Market Intelligence</h3>
              <p className="text-sm text-gray-600">We surface firms that aren't publicly listed for sale, identified through predictive modeling.</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900">Daily Picks</h3>
              <p className="text-sm text-gray-600">Every day, Canary features one carefully selected firm positioned for acquisition.</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900">Managed Outreach</h3>
              <p className="text-sm text-gray-600">We handle all communication with firm owners, ensuring professional engagement.</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900">Risk-Free Model</h3>
              <p className="text-sm text-gray-600">Access is free—Canary earns a 2.5% success fee only when you close a deal.</p>
            </div>
          </div>
          <button 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors mx-auto"
            onClick={handleLinkedInSignup}
          >
            <span>Sign Up with LinkedIn</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </div>
  );
};