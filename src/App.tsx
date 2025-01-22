import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/AppSidebar";
import { CommandBar } from "@/components/CommandBar";
import Index from "@/pages/Index";
import Analysis from "@/pages/Analysis";
import MarketReport from "@/pages/MarketReport";
import StateMarketReport from "@/pages/StateMarketReport";
import ThankYou from "@/pages/ThankYou";
import BuyerDashboard from "@/pages/BuyerDashboard";

export default function App() {
  const session = useSession();

  return (
    <Router>
      <div className="min-h-screen">
        {session && (
          <>
            <AppSidebar />
            <CommandBar />
          </>
        )}
        <main className={session ? "md:ml-64" : ""}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/buyer-dashboard" 
              element={
                <div className="p-8">
                  <BuyerDashboard />
                </div>
              } 
            />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/market-report/:county/:state" element={<MarketReport />} />
            <Route path="/state-market-report" element={<StateMarketReport />} />
            <Route path="/thank-you" element={<ThankYou />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </Router>
  );
}