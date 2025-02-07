
import Map from "@/components/Map";
import { Hero } from "@/components/Hero";
import { Bird } from "lucide-react";
import { DataSourcesSection } from "@/components/DataSourcesSection";
import { SolutionsSection } from "@/components/SolutionsSection";
import { Card } from "@/components/ui/card";
import { PricingSection } from "@/components/PricingSection";
import { BetaAccessSection } from "@/components/BetaAccessSection";
import CountdownBanner from "@/components/CountdownBanner";
import { DailyRevealsSection } from "@/components/DailyRevealsSection";
import { DatabaseSection } from "@/components/DatabaseSection";
import { WhyProfessionalServices } from "@/components/WhyProfessionalServices";
import { HowItWorks } from "@/components/HowItWorks";
import { ValueProposition } from "@/components/ValueProposition";
import { CatalystSection } from "@/components/CatalystSection";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* LedgerFund Banner */}
      <div className="bg-[#8B5CF6] text-white text-center py-2 px-4">
        <a 
          href="https://www.ledgerfund.info/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline inline-block w-full"
        >
          Own a Stake in Accounting Firms. Join the LedgerFund Pre-Sale Round Today →
        </a>
      </div>

      {/* Countdown Banner */}
      <CountdownBanner />

      {/* Fixed Map Background */}
      <div className="fixed inset-0 z-0">
        <Map />
      </div>

      {/* Fixed Header with Logo */}
      <div className="fixed top-[84px] left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bird className="w-8 h-8 animate-color-change text-yellow-400" />
            <span className="text-xl font-bold text-yellow-400">Canary</span>
          </div>
          {session ? (
            <div className="flex items-center gap-4">
              <Link to="/tracked-practices" className="text-white hover:text-yellow-400 transition-colors font-sans">
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-white hover:text-yellow-400 transition-colors font-sans"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/firm-owners" className="text-white hover:text-yellow-400 transition-colors font-sans">
                Firm Owners
              </Link>
              <Link to="/auth" className="text-white hover:text-yellow-400 transition-colors font-sans">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 pt-[132px]">
        {/* Hero Section */}
        <div className="min-h-screen">
          <Hero />
        </div>

        {/* Value Proposition */}
        <ValueProposition />

        {/* Beta Access Section */}
        <BetaAccessSection />

        {/* Database Section */}
        <DatabaseSection />

        {/* Daily Reveals Section */}
        <DailyRevealsSection />

        {/* Data Sources Section */}
        <DataSourcesSection />

        {/* Catalyst Section */}
        <CatalystSection />

        {/* Why Professional Services Section */}
        <WhyProfessionalServices />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Pricing Section */}
        <PricingSection />
      </div>
    </div>
  );
};

export default Index;
