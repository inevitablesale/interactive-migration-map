import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bird } from "lucide-react";
import { supabase } from "./integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Index from "./pages/Index";
import Analysis from "./pages/Analysis";
import Dashboard from "./pages/Dashboard";
import MarketReport from "./pages/MarketReport";
import StateMarketReport from "./pages/StateMarketReport";
import ThankYou from "./pages/ThankYou";
import Opportunities from "./pages/Opportunities";

function App() {
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
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
      console.error("Sign in error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Failed to sign in. Please try again.",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          variant: "destructive",
          title: "Sign Out Error",
          description: error.message,
        });
      } else {
        toast({
          title: "Signed out successfully",
        });
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  return (
    <Router>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bird className="w-8 h-8 animate-color-change text-yellow-400" />
            <span className="text-xl font-bold text-yellow-400">Canary</span>
          </div>
          <div>
            {user ? (
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="bg-transparent border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-200"
              >
                Sign Out
              </Button>
            ) : (
              <Button
                onClick={handleSignIn}
                className="bg-yellow-400 text-black hover:bg-yellow-500 transition-all duration-200"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/market-report" element={<MarketReport />} />
        <Route path="/state-market-report" element={<StateMarketReport />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/opportunities" element={<Opportunities />} />
      </Routes>
    </Router>
  );
}

export default App;