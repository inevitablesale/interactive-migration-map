import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Bird } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get("signup") === "true";

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        try {
          // Check if user has documents in user_documents table
          const { data: userDocs, error } = await supabase
            .from('user_documents')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (error) throw error;

          // If no documents found or success fee not signed, redirect to doc signing
          if (!userDocs || !userDocs.success_fee_signed) {
            console.log("Redirecting to doc-sign - documents not signed");
            navigate("/doc-sign");
          } else {
            // Existing user with signed documents - redirect to tracked practices
            console.log("Redirecting to tracked practices - documents already signed");
            navigate("/tracked-practices");
          }
        } catch (error) {
          console.error('Error checking document status:', error);
          // If there's an error checking documents, default to doc-sign
          navigate("/doc-sign");
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
