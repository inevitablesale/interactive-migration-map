import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Index from "@/pages/Index";
import Analysis from "@/pages/Analysis";
import Opportunities from "@/pages/Opportunities";
import MarketReport from "@/pages/MarketReport";
import StateMarketReport from "@/pages/StateMarketReport";
import ThankYou from "@/pages/ThankYou";
import Dashboard from "@/pages/Dashboard";
import { Button } from "@/components/ui/button";
import { Bird } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check current auth status
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
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
      });
    }
  };

  return (
    <Router>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bird className="w-8 h-8 animate-color-change text-yellow-400" />
            <span className="text-xl font-bold text-yellow-400">Canary</span>
          </div>
          {user ? (
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="text-white hover:text-yellow-400"
            >
              Sign Out
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={handleSignIn}
              className="text-white hover:text-yellow-400"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* Add padding to account for fixed header */}
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/market-report/:county/:state" element={<MarketReport />} />
          <Route path="/state-market-report/:state" element={<StateMarketReport />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;