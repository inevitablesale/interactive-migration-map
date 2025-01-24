import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bird } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get("signup") === "true";

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: documents } = await supabase
          .from('user_documents')
          .select('success_fee_signed')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!documents || !documents.success_fee_signed) {
          navigate("/document-signing");
        } else {
          navigate("/tracked-practices");
        }
      }
    };
    checkSession();
  }, [navigate]);

  const handleLinkedInAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/auth`,
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
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/90 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Bird className="w-12 h-12 text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {isSignUp ? "Join Canary" : "Welcome Back"}
          </h1>
          <p className="text-gray-600">
            {isSignUp 
              ? "Create an account to access exclusive opportunities" 
              : "Sign in to continue to your account"}
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
            onClick={handleLinkedInAuth}
          >
            <Linkedin className="w-5 h-5" />
            <span>{isSignUp ? "Sign up with LinkedIn" : "Sign in with LinkedIn"}</span>
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
            </span>
            <a 
              href={isSignUp ? "/auth" : "/auth?signup=true"} 
              className="text-blue-600 hover:text-blue-800"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}