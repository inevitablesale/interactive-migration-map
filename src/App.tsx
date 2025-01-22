import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bird } from "lucide-react";
import { supabase } from "./integrations/supabase/client";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/AppSidebar";
import { CommandBar } from "@/components/CommandBar";
import Analysis from "@/pages/Analysis";
import BuyerDashboard from "@/pages/BuyerDashboard";
import MarketReport from "@/pages/MarketReport";
import StateMarketReport from "@/pages/StateMarketReport";
import ThankYou from "@/pages/ThankYou";
import Opportunities from "@/pages/Opportunities";
import Index from "@/pages/Index";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Bird className="w-8 h-8 text-blue-500 animate-bounce" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {session && (
          <>
            <AppSidebar />
            <CommandBar />
          </>
        )}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/market-report/:county/:state" element={<MarketReport />} />
          <Route path="/state-market-report" element={<StateMarketReport />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/opportunities" element={<Opportunities />} />
        </Routes>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;