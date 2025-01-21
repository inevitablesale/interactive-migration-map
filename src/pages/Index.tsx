import Map from "@/components/Map";
import { Hero } from "@/components/Hero";
import { DataSourcesSection } from "@/components/DataSourcesSection";
import { SolutionsSection } from "@/components/SolutionsSection";
import { PricingSection } from "@/components/PricingSection";
import { BetaAccessSection } from "@/components/BetaAccessSection";
import CountdownBanner from "@/components/CountdownBanner";
import { DailyRevealsSection } from "@/components/DailyRevealsSection";
import { DatabaseSection } from "@/components/DatabaseSection";
import { WhyProfessionalServices } from "@/components/WhyProfessionalServices";
import { HowItWorks } from "@/components/HowItWorks";
import { ValueProposition } from "@/components/ValueProposition";
import { CatalystSection } from "@/components/CatalystSection";
import { Header } from "@/components/Header";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Countdown Banner */}
      <CountdownBanner />

      {/* Fixed Map Background */}
      <div className="fixed inset-0 z-0">
        <Map />
      </div>

      {/* Header with Sign In */}
      <Header showSignIn />

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