import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkDocuments = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        try {
          const { data: userDocs, error } = await supabase
            .from('user_documents')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (error) throw error;

          if (!userDocs || !userDocs.success_fee_signed) {
            console.log("Redirecting to doc-sign - documents not signed");
            navigate("/doc-sign");
          }
        } catch (error) {
          console.error('Error checking document status:', error);
          navigate("/doc-sign");
        }
      }
    };

    checkDocuments();
  }, [navigate]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Countdown Banner */}
      <CountdownBanner />

      {/* Fixed Map Background */}
      <div className="fixed inset-0 z-0">
        <Map />
      </div>

      {/* Fixed Header with Logo */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bird className="w-8 h-8 animate-color-change text-yellow-400" />
            <span className="text-xl font-bold text-yellow-400">Canary</span>
          </div>
          <Link to="/auth" className="text-white hover:text-yellow-400 transition-colors">
            Sign In
          </Link>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 pt-20">
        {/* Hero Section */}
        <div className="min-h-screen">
          <Hero />
        </div>

        {/* Value Proposition */}
        <ValueProposition />

        {/* Beta Access Section */}
        <BetaAccessSection />

        {/* Database Section - Moved above DailyRevealsSection */}
        <DatabaseSection />

        {/* Daily Reveals Section */}
        <DailyRevealsSection />

        {/* Data Sources Section - Contains tracking metrics */}
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