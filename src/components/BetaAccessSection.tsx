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
            Get exclusive early access to the first data-driven market intelligence platform for accounting firm acquisitions. Our platform connects you with off-market firms that haven't publicly listed for sale, using advanced analytics to identify high-potential opportunities.
          </p>
          <div className="grid md:grid-cols-4 gap-6 mb-8 text-left">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900">Off-Market Firms</h3>
              <p className="text-sm text-gray-600">These firms aren't listed for sale. We surface opportunities before anyone else knows they exist.</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900">Anonymity & Trust</h3>
              <p className="text-sm text-gray-600">All firm profiles are anonymized to protect seller privacy and ensure trust.</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900">Managed Outreach</h3>
              <p className="text-sm text-gray-600">We handle seller engagement professionally and facilitate NDAs before sharing details.</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900">Risk-Free Model</h3>
              <p className="text-sm text-gray-600">Access everything for free. 2.5% success fee only when you close the deal.</p>
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